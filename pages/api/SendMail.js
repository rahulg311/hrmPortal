import axios from 'axios';
import { EmailBase, HostFileURL, UpdatedOfferLetterView, baseUrl, uploadFileBaeUrl } from '../../src/constants/constants';
import { MethodNames } from '../../src/constants/methodNames';
import OfferFunct from './OfferFuncst';
import moment from "moment/moment";
import fs from 'fs'
import { PDFBASEPATH } from './Api';
import { exportWebsiteAsPdf } from './createPdf';

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
    console.log("createPDF called");
    let {flag,UserId}=req.body
    const EmpOfferLetter = {
        EmpId: EmpId,
      };
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Note: Months are zero-indexed, so add 1 to get the actual month (e.g., 8 for August)
    const day = currentDate.getDate();

    const CurrentDates = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

    let empDoc= await axios.post(baseUrl + MethodNames.EmpOfferDocumentList, EmpOfferLetter)
    let empDocList=empDoc.data.EmpOfferDocumentList

    let fileName= EmpData && EmpData.EmpName ? EmpData.EmpName.replace(/ /g,"_")+`_${EmpId}_${moment(new Date()).format("MM-DD-YYYY-HH-mm-ss")}.PDF`:`Offer_Letter_${EmpId}_${moment(new Date()).format("MM-DD-YYYY-HH-mm-ss")}.PDF`
    let OfferLetterFileName= EmpData && EmpData.OfferLetterFileName
    let prevFileName =`${PDFBASEPATH}/public/OfferLetters/${OfferLetterFileName}`


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
     
  
    // ****************END************************************
    // const modifiedHTML = await OfferFunct(EmpData,empDocList)
    
    const modifiedHTML = await OfferFunct(EmpData,empDocList,EmpDeduction,EmpEarningData,EmpNetSalary,EmpContribution,EarningOthers,CurrentDates,EmpOfferEarningTotal,EmpDeductionTotal)


    if (fs.existsSync(prevFileName)) {
        await fs.unlink(prevFileName,(err) => {
            if (err) {
                console.error('Error creating PDF:', err);
                //   res.status(400).json({ success: false,message:err });
                exportWebsiteAsPdf(modifiedHTML, `${PDFBASEPATH}/public/OfferLetters/${fileName}`).then(async (file_buffer) => {
                    console.log("offer letter genrated",fileName)

                    let uploadRes=await uploadFile(fileName);
                    console.log("uploadFile res:",uploadRes);
                    if(!uploadRes || !uploadRes.success){
                        res.status(400).json(uploadRes);
                        return 
                    }
                    let postData= [{"EmpId":EmpId,"OfferLetterFileName":fileName,"UserId":UserId}]
                    const UpsertMaster = JSON.stringify(postData);
                    const MasterEmployeeAUpdate = {
                    OperationType: "Update",
                    JsonData: UpsertMaster,
                    };
            
                    axios.post(baseUrl + MethodNames.UpsertMasterEmployeeOfferLetter, MasterEmployeeAUpdate).then(()=>{
                    if(flag=="sendmail"){
                        sendMail(req,res,EmpData,fileName)
                    }else{
                        res.status(200).json({ success: true,message:"PDF is Updated successful" });
                    }
                }).catch((error)=>{
                    console.log('PDF created error.',error);
                    res.status(400).json({ success: false,message:error });
                })
                }).catch((error) => {
                    res.status(400).json({ success: false });
                    console.error('Error creating PDF:', error);
                });
            } else {
              createPDF(req,res,EmpData,EmpId) 
            }
        })
        // exportWebsiteAsPdf(modifiedHTML, `${PDFBASEPATH}/public/OfferLetters/${fileName}`).then((file_buffer) => {
        //     console.log("offer letter genrated",fileName)
        //     sendMail(req,res,EmpData,fileName)
        // }).catch((error) => {
        //     res.status(400).json({ success: false });
        //     console.error('Error creating PDF:', error);
        // });

    }else{

        exportWebsiteAsPdf(modifiedHTML, `${PDFBASEPATH}/public/OfferLetters/${fileName}`).then( async(file_buffer) => {
            console.log("offer letter genrated",fileName)
                let postData= [{"EmpId":EmpId,"OfferLetterFileName":fileName,"UserId":UserId}]

               let uploadRes=await uploadFile(fileName);
                console.log("uploadFile res2:",uploadRes);
                if(!uploadRes || !uploadRes.success){
                    res.status(400).json(uploadRes);
                    return 
                }
                const UpsertMaster = JSON.stringify(postData);
                const MasterEmployeeAUpdate = {
                OperationType: "Update",
                JsonData: UpsertMaster,
                };
        
                axios.post(baseUrl + MethodNames.UpsertMasterEmployeeOfferLetter, MasterEmployeeAUpdate).then(()=>{
                if(flag=="sendmail"){
                    sendMail(req,res,EmpData,fileName)
                }else{
                    res.status(200).json({ success: true,message:"PDF is Updated successful" });
                }
            }).catch((error)=>{
                console.log('PDF created error.',error);
                res.status(400).json({ success: false,message:error });
            })
            // if(flag=="sendmail"){
            //     sendMail(req,res,EmpData,fileName)
            // }else{
            //     res.status(200).json({ success: true,message:"PDF is Updated successful" });
            // }
        }).catch((error) => {
            res.status(400).json({ success: false });
            console.error('Error creating PDF:', error);
        });
    }
    

}
 
async function sendMail(req,res,EmpData,fileName="") { 
    const { EmpId,TempleteId,flag } = req.body;

    let flagStatus=flag=="revoke";
    let localFilePath=`${PDFBASEPATH}/public/OfferLetters/${fileName}`

    const EmpOfferLetter = {
        EmpId: EmpId,
        EmailType:"Offer Letter"
    };

    // get email configuration like : CC , subject , from , to and other details
    let emailRes= await axios.post(baseUrl + MethodNames.ViewEmailConfig, EmpOfferLetter)
    let emailDetails=emailRes.data.ViewEmailConfig[0];
    console.log("emailDetails----",baseUrl + MethodNames.ViewEmailConfig,EmpOfferLetter,emailDetails)

    // attach offer letter
    let Attachments= [{   // file on disk as an attachment
        // filename: `${fileName}`,
        path: `${UpdatedOfferLetterView}${fileName}` // stream this file
    }]

    let HTMLContent=""
    if(flagStatus){
        HTMLContent= `<p>Dear ${EmpData.EmpName},
        <br> <br>
        This is in reference to the offer letter issued to you on ${moment().format("DD/MM/YYYY")}, you are hereby informed that your offer letter has been revoked and is no longer valid.<br><br>Please contact CPM HR for any clarifications<br><br>Thanks<br><br> Regards<br><br>TEAM CPM HR</p>` 
        
        // This is in reference to the offer letter issued to you on ${moment().format("DD/MM/YYYY")}. We wish to inform you that your offer letter has been revoked and is no more valid. <br><br>Please contact CPM HR for any clarifications<br><br>Thanks<br><br> Regards<br><br>TEAM CPM HR</p>` 
    }else{
        HTMLContent= `<p>Dear ${EmpData.EmpName},
        <br> <br>
        we are happy to inform you that you have been selected for the position you had applied for 
        the Offer Letter is hereby attached for your reference.<br> Please feel free to call us for any clarifications. <br><br>Your Sincerely <br></br>HR Dept.</p>`
    }

    const emailData={
        // "To":"nishantlodhi2468@gmail.com",
        "To":emailDetails.EmailTo ||"",
        "CC":emailDetails.EmailCC||"",
        "Subject":flagStatus ? "Revoke of offer letter":"Offer Letter",
        "From":emailDetails.EmailFrom,
        "HTMLContent": HTMLContent,
        "AttachmentAvlbl": flagStatus ? false:true,
        "Attachments":Attachments
    }

    // const emailData={"To":"rahul.kumar@cpmindia.com","CC":"nishant.rajput@cpmindia.com","Subject":"Offer Letter","From":"reports@cpmindia.com","HTMLContent":
    // `<p>Dear ${EmpData.EmpName},</br> </br>we are happy to inform you that you have been selected for the position you had applied for 
    // the Offer Letter is hereby attached for your refernce.</br> Please feel free to call us for any clarifications. </br></br>Your Sincerely </br></br>HR Dept.</p>`,
    // "AttachmentAvlbl":true,"Attachments":Attachments}
    // esha.khare@cpmindia.com
    // rahul.kumar@cpmindia.com
    // mahesh.upadhyay@cpmindia.com,
    // console.log("emailData -----",emailData)
    
    // send mail to employee
    await axios.post(EmailBase + MethodNames.Email, emailData)
    .then(async (resData) => {
        console.log("emailData -----2",resData.data)

        let {success,Error}=resData.data;
        if(success==true){
            console.log("emailData -----3")

            if(flagStatus){
                res.status(200).json({ success: true });
                return
            }

            let setFileNameSR= {"EmpId":EmpData.EmpId,"OfferTempleteId":TempleteId,"OfferLetterFileName":fileName,"UserName":EmpData.EmpName}

            await axios.post(baseUrl + MethodNames.UpsertOfferLetterSend, setFileNameSR)
            .then((resDat) => {
                let checkRes=resDat.data && resDat.data.UpsertOfferLetterSend &&resDat.data.UpsertOfferLetterSend[0] && resDat.data.UpsertOfferLetterSend[0].RecordStatus
                if(checkRes=="Success"){
                    console.log("sendmail successful-1",localFilePath)
                    fs.unlink(localFilePath,(err) => {
                        console.log("err--------1",err)
                        if (err) {
                            console.error('Error creating PDF:', err);
                            res.status(400).json({ success: false,message:err });
                          } else {
                            console.log("sendmail successful-2")
                            res.status(200).json({ success: true });
                          }
                     })
                }else{
                    res.status(400).json({ success: false });
                }

             }).catch((e)=>{
                res.status(400).json({ success: false , Error:e});
            });

        }else{
            res.status(400).json({ success: false });
        }
    }).catch((e)=>{
        res.status(400).json({ success: false , Error:e});
    });
}




export default async function handler(req, res) {
    console.log("sendmail handler called")
    const { EmpId,TempleteId,flag } = req.body;
    const EmpOfferLetter = {
        // EmpId: 4,
        EmpId: EmpId,       
    };

    const empDetails = await axios.post(baseUrl + MethodNames.EmpOfferLetterBasicInfo, EmpOfferLetter)

    let EmpData=empDetails.data.EmpOfferLetterBasicInfo[0]
    
    let fileName=EmpData.OfferLetterFileName
    let path=`${PDFBASEPATH}/public/OfferLetters/${fileName}.PDF`
    // createPDF(req,res,EmpData,EmpId)
    // check if file exists or not
    if(flag=="revoke"){
        // send mail
        sendMail(req,res,EmpData,"")
    }else{
        // generate pdf and send mail
        createPDF(req,res,EmpData,EmpId)
    }
  
}