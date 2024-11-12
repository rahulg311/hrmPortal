import axios from 'axios';
import { baseUrl, uploadFileBaeUrl } from '../../src/constants/constants';
import { MethodNames } from '../../src/constants/methodNames';
import OfferFunct from './OfferFuncst';
import puppeteer from 'puppeteer';
import moment from "moment/moment";
import fs from 'fs'
import { PDFBASEPATH } from './Api';
import { LoginUserId } from './AllApi';

// const puppeteer = require('puppeteer');


export async function exportWebsiteAsPdf(html, outputPath) {
    console.log("exportWebsiteAsPdf called",outputPath)
    // Create a browser instance
    const browser = await puppeteer.launch({
      headless: 'new'
    });
    // Create a new page
    const page = await browser.newPage();
    console.log("browser new page opened")
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    console.log("html content set")

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');
    console.log("css set")

    console.log("start downloading pdf...")
    // Download the PDF
    const PDF = await page.pdf({
      path: outputPath,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
      printBackground: true,
      format: 'A4',
    });

    console.log("pdf downloaded.")
    // Close the browser instance
    await browser.close();
    console.log("close browser")
    return PDF;
  }

    //  upload file 
    async function uploadFile(filename) {
      let filePath=`${PDFBASEPATH}/public/OfferLetters/${filename}`
      console.log("id proof file name------ ",filename)
      try {
        console.log("uploadFile filename:", filename);
  
        const formData = new FormData();
        const file_buffer = fs.readFileSync(filePath);
        const file_blob = new Blob([file_buffer]);
        formData.append('filename', filename);
        formData.append('folderName', "offerletters");
        formData.append('file',file_blob);
      //   console.log("formData2:", formData);
  
        return await axios({
          method: 'post',
          // url: uploadFileBaeUrl + 'uploadFile',
          url:uploadFileBaeUrl,
          data: formData,
          // headers: {
          //   "Content-Type": "multipart/form-data",
          // }
        }).then((res) => {
              // readStream.close();
              if(res.status == 200){
                  return res.data;
              }
              else{
                  return {success:false};
              }
            
          }).catch((err) => {
              // readStream.close();
              console.log('err:', err);
              return {success:false};
          });
      } catch (error) {
        // Handle errors
        console.error('Error uploading file:', error);
        return {succes:false};
      }
    }

  async function createPDF(req,res,EmpData,EmpId) {

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Note: Months are zero-indexed, so add 1 to get the actual month (e.g., 8 for August)
    const day = currentDate.getDate();
    const CurrentDates = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
console.log("t1--------1")
    const {
      query: { UserId,empId },
      method,
    } = req;

    const EmpOfferLetter = {
      // EmpId: 4,
      EmpId: EmpId,
    };

    //   EmpOfferDocumentList
  let empDoc= await axios.post(baseUrl + MethodNames.EmpOfferDocumentList, EmpOfferLetter)
  let empDocList=empDoc.data.EmpOfferDocumentList

  //   EmpOfferLetterDeduction
  const EmpOfferLetterDeductionData = await axios.post(baseUrl + MethodNames.EmpOfferLetterDeduction, EmpOfferLetter)

  let EmpDeduction=EmpOfferLetterDeductionData.data.EmpOfferLetterDeduction
  //   EmpOfferLetterEarning
  const EmpEarning = await axios.post(baseUrl + MethodNames.EmpOfferLetterEarning, EmpOfferLetter)

  let EmpEarningData=EmpEarning.data.EmpOfferLetterEarning

  //   EmpOfferLetterGrossAndNetSalary
  const EmpNetSalaryData = await axios.post(baseUrl + MethodNames.EmpOfferLetterGrossAndNetSalary, EmpOfferLetter)
  let EmpNetSalary=EmpNetSalaryData.data.EmpOfferLetterGrossAndNetSalary


  //   EmpOfferLetterEmployerContribution
  const EmpContributionData = await axios.post(baseUrl + MethodNames.EmpOfferLetterEmployerContribution, EmpOfferLetter)
  let EmpContribution=EmpContributionData.data.EmpOfferLetterEmployerContribution

  //   EmpOfferLetterEarningOthers
  const EarningOthersData = await axios.post(baseUrl + MethodNames.EmpOfferLetterEarningOthers, EmpOfferLetter)
  let EarningOthers=EarningOthersData.data.EmpOfferLetterEarningOthers

  // total count EmpOfferEarningTotal 
  const EmpOfferEarningTotal = EmpEarningData && EmpEarningData.reduce((acc, curr) => acc + curr.PayCompValue, 0);
  const EmpDeductionTotal = EmpDeduction && EmpDeduction.reduce((acc, curr) => acc + curr.PayCompValue, 0);
   
  let fileName= EmpData && EmpData.EmpName ? EmpData.EmpName.replace(/ /g,"_")+`_${EmpId}_${moment(new Date()).format("MM-DD-YYYY-HH-mm-ss")}.PDF`:`Offer_Letter_${EmpId}_${moment(new Date()).format("MM-DD-YYYY-HH-mm-ss")}.PDF`

  const modifiedHTML = await OfferFunct(EmpData,empDocList,EmpDeduction,EmpEarningData,EmpNetSalary,EmpContribution,EarningOthers,CurrentDates,EmpOfferEarningTotal,EmpDeductionTotal)
  console.log("t1--------2")


    exportWebsiteAsPdf(modifiedHTML, `${PDFBASEPATH}/public/OfferLetters/${fileName}`).then(async () => {
      // const userid = await LoginUserId();
      let postData= [{"EmpId":EmpId,"OfferLetterFileName":fileName,"UserId":UserId}]

      const UpsertMaster = JSON.stringify(postData);
      const MasterEmployeeAUpdate = {
        OperationType: "Update",
        JsonData: UpsertMaster,
      };
      
 console.log("t1--------3")

 let uploadRes=await uploadFile(fileName);

 if(!uploadRes || !uploadRes.success){
  res.status(400).json(uploadRes);
  return 
}

 let setFileNameSR= {"EmpId":EmpData.EmpId,"OfferTempleteId":EmpData.OfferTempleteId,"OfferLetterFileName":fileName,"UserName":EmpData.EmpName}

            await axios.post(baseUrl + MethodNames.UpsertOfferLetterSend, setFileNameSR)
            .then((resDat) => {
                let checkRes=resDat.data && resDat.data.UpsertOfferLetterSend &&resDat.data.UpsertOfferLetterSend[0] && resDat.data.UpsertOfferLetterSend[0].RecordStatus
                if(checkRes=="Success"){
                console.log("file name is updated on server UpsertOfferLetterSend")
                }else{
                    res.status(400).json({ success: false });
                }

             }).catch((e)=>{
                res.status(400).json({ success: false , Error:e});
            });



      axios.post(baseUrl + MethodNames.UpsertMasterEmployeeOfferLetter, MasterEmployeeAUpdate).then(()=>{
        if (fs.existsSync(`${PDFBASEPATH}/public/OfferLetters/${fileName}`)) {
          // Set the appropriate headers
          res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
          res.setHeader('Content-Type', 'application/pdf');
      
          // Create a read stream from the file
          const stream = fs.createReadStream(`${PDFBASEPATH}/public/OfferLetters/${fileName}`);
      
          // Pipe the file stream to the response
          stream.pipe(res);
        //   fs.unlink(`${PDFBASEPATH}/public/OfferLetters/${fileName}`,(err) => {
        //     console.log("err--------1",err)
        //     if (err) {
        //         console.error('Error creating PDF:', err);
        //       } else {
        //         console.log("sendmail successful-2")
        //       }
        //  })
        } else {
          res.status(404).end();
        }
        console.log('PDF created successfully.');
      }).catch((error)=>{
        console.log('PDF created error.',error);
        res.status(400).json({ success: false,message:error });
      })
      

   
    }).catch((error) => {
      console.error('Error creating PDF:', error);
    });


  }

export default async function handler(req, res) {

  const {
    query: { name, keyword,empId },
    method,
  } = req;

  // get curreent date 

console.log("t1--------1.1")

  const EmpOfferLetter = {
    // EmpId: 4,
    EmpId: empId,
  };

  const empDetails = await axios.post(baseUrl + MethodNames.EmpOfferLetterBasicInfo, EmpOfferLetter)
  let EmpData=empDetails.data.EmpOfferLetterBasicInfo[0]


  console.log("empDetails--------2tes",EmpData)
  if(EmpData.OfferLetterFileName){
    console.log("t1--------1.3")
  let prevFileName =`${PDFBASEPATH}/public/OfferLetters/${EmpData.OfferLetterFileName}`
  let fileExist = await fs.existsSync(prevFileName)

  if(fileExist){
    console.log("fileExist-------",fileExist,prevFileName)
    await fs.unlink(prevFileName,(err) => {
      if (err) {
        console.error('Error creating PDF:', err);
        res.status(400).json({ success: false,message:err });
      } else {
        createPDF(req,res,EmpData,empId) 
      }
  })
    // .then(() => {
    //   createPDF(req,res,EmpData,empId) 
    //   }).catch((error) => {
    //   res.status(400).json({ success: false });
    //   console.error('Error creating PDF:', error);
    // });
  }else{
    console.log("t1--------1.2")
    createPDF(req,res,EmpData,empId) 
  }
  }else{
    console.log("t1--------1.2")
    createPDF(req,res,EmpData,empId) 
  }

  // if (fs.existsSync(`${PDFBASEPATH}/public/OfferLetters/${EmpData.OfferLetterFileName}`)) {

  //   let fileName =EmpData.OfferLetterFileName
  //   res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  //   res.setHeader('Content-Type', 'application/pdf');

  //   // Create a read stream from the file
  //   const stream = fs.createReadStream(`${PDFBASEPATH}/public/OfferLetters/${fileName}`);

  //   // Pipe the file stream to the response
  //   stream.pipe(res);
    

  // }else{
  //   createPDF(req,res,EmpData,empId) 
  
  // }
  }