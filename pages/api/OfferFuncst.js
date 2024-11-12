// const fs = require(fs);
import fs from 'fs';
import path from 'path';
import { PDFBASEPATH } from './Api';


export default async function OfferFunct(props,empDocList,EmpDeduction,EmpEarningData,EmpNetSalary,EmpContribution,EarningOthers,CurrentDates,EmpOfferEarningTotal,EmpDeductionTotal) { 
    console.log("OfferFunct called path------",EmpDeduction)

    var logoBase64str = base64_encode(`${PDFBASEPATH}/pages/HRM_Images/offer_letter_logo.png`);
    var addressBase64str = base64_encode(`${PDFBASEPATH}/pages/HRM_Images/address.png`);
    var signatureBase64str = base64_encode(`${PDFBASEPATH}/pages/HRM_Images/Signature_DGM_HR.jpg`);

  
    function base64_encode(file) {
        return "data:image/png;base64,"+fs.readFileSync(file, 'base64');
    }

    console.log("props---",props)
    let res= `
    <!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title></title>
      <br />
      <style type="text/css">
         p {margin: 0; padding: 0;}  .ft10{font-size:13px;font-family:Times;color:#000000;}
         .ft11{font-size:13px;font-family:Times;color:#000000;}
         .ft12{font-size:14px;font-family:Times;color:#000000;}
         .ft13{font-size:13px;line-height:18px;font-family:Times;color:#000000;}
         .ft14{font-size:13px;line-height:26px;font-family:Times;color:#000000;}
         .ft15{font-size:13px;line-height:27px;font-family:Times;color:#000000;}
         .ft16{font-size:13px;line-height:21px;font-family:Times;color:#000000;}
         .ft17{font-size:13px;line-height:21px;font-family:Times;color:#000000;}
      </style>
      <style>
         :root {
         --ff-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
         "Helvetica Neue", Arial, sans-serif;}
         p{
         font-family: var(--ff-primary);
         }
         table {
         font-family: arial, sans-serif;
         border-collapse: collapse;
         width: 100%;
         }
         th{
         background-color: #dddddd;
         }
         td, th {
         border: 1px solid hsl(0, 2%, 53%);
         text-align: left;
         padding: 6px;
         font-size: 13px;
         }
         .th_center{
         text-align: center;
         width: 30%;
         }
         tr:nth-child(even) {
         background-color: #ffff;
         }
         .div_table{
         position: relative;
         /* top: 61px; */
         top: 178px;
         margin: auto;
         /* padding: 45px; */
         width: 95%;
         display: flex;
         }
      </style>
   </head>
   <body bgcolor="#ffffff" vlink="blue" link="blue">
      <div style="width:100%">
         <div  style="font-weight:500; overflow-y:scroll ; width:100%; height:100%>
            <div  style="font-weight:500; width:100%; height:530px ; overflow-y:overlay">
            <div id=page1-div style="font-weight:500; position: relative; width: 770px; height: 1080px; margin: 0% 0%; border: 2px solid gray">
               <div>
                  <div id=page1-div style="font-weight:500; background-color: #e4e3e3; border-bottom: 0px solid gray; display: flex; justifyContent: space-between; padding: 5px 0px">
                     <div style="font-weight:500;width: 58%;     margin-top: 1%; margin-bottom: 0%">
                        <img width={200} height={65} src="${logoBase64str}"alt=background image />
                     </div>
                     <div style="font-weight:500;     margin-top: 1%; margin-bottom: 0%">
                      <img
                        width="90%"
                        height="62"
                        src="${addressBase64str}"
                        alt="background image"
                    />
                       </div>
                  </div>
                  <div style="font-weight:500;     background-color: rgb(238, 237, 237); border-bottom: 1px solid gray; height: 20px; width: 100%"></div>
                  <div style="font-weight:500; padding: 30px">
                     <div style="height:100%">
                        <p style="font-weight:500;     font-size:14px"> <b style="font-weight:700">Date:</b>  <b style="font-weight:400"> ${CurrentDates}</b> </p>
                        <p style="font-weight:500;     margin-top:10px;    font-size:14px">${props.EmpName} </p>
                        <p style="font-weight:500;     font-size:14px">   ${props.CurrentAddress} ${props.CurrentCity} ${props.CurState} Pin Code ${props.CurrentPincode}</p>
                        <p style="font-weight:500;     margin-top:10px;    font-size:14px">
                           Re : Offer for the post of&nbsp;<b>${props.DesignationName} <br /></b>Dear&nbsp;<b>${props.EmpName}</b><br/>
                        </p>
                        <p style="font-weight:500;     margin-top:10px;    font-size:14px">We are pleased to make an offer to you on behalf of CPM India Sales & Marketing Pvt Ltd.</p>
                        <p style="font-weight:500;     font-size:14px;    margin-top:5px">for the position of&nbsp;<b>${props.DesignationName}</b></p>
                        <p style="font-weight:500;     font-size:14px;    margin-top:5px" >The Position carries CTC salary of Rs.<b>         ${EmpNetSalary && EmpNetSalary.map((item)=>{
                           return item.Yctc} ).join("<br/>")}</b> </p>
                        <p style="font-weight:500;     font-size:14px;    margin-top:10px" >In event of your resignation or termination of services; either side will have to give <b style="font-weight:700">${props.NoticePeriod}</b> <br/>
                           notice or salary in lieu thereof. 
                        </p>
                        <div style="font-weight:500; padding-left:0px;padding-right:20px;     margin-top:10px">
                           <p style="font-weight:500;     font-size:14px;    margin-top:10px" >Your appointment will be subject to your furnishing the following documents and verification
                              of the same 
                           </p>
                        </div>
                        <p style="font-weight:500;     font-size:14px;    margin-top:10px">
                        ${empDocList && empDocList.map((item)=>{
                           return item.DocName }).join("<br/>")}  </p>
                     </div>
                     <p style="font-weight:500;     font-size:14px;    margin-top:15px">Kindly sign and return the duplicate copy of this letter.</p>
                     <p style="font-weight:500;     font-size:14px;    margin-top:5px">We expect you to join your duties on <b style="font-weight:700">${props.ProjectedDOJ}</b></p>
                     <p style="font-weight:500;     font-size:14px;    margin-top:10px">You shall be on a probation period of <b>${props.ProbationPeriod}</b> day’s with the Company. </p>
                     <div>
                        <div style="font-weight:500; width:250px; height:200px; margin-top: 40px;margin-left: 23px;width: 250px;height: 62px;
                           ">
                           <img style="font-weight:500; width: 206px; background-color: rgb(211, 211, 211)" width={140} height={53}     src="${signatureBase64str}" alt=background image />
                        </div>
                        <p style="font-weight:500;     font-size:14px;    margin-top:0px" className=ft13>
                           With best wishes&nbsp;<br />For CPM India Sales &amp; Marketing Pvt Ltd.
                        </p>
                        <p style="font-weight:500;     font-size:14px;    margin-top:10px" className=ft16>
                           Acceptance of the offer letter:<br />I will be able to join from
                        </p>
                        <p style="font-weight:500;      font-size:14px ; position: absolute; top: 960px; left: 646px; whiteSpace: nowrap" className=ft11>
                           Signature
                        </p>
                        <p style="font-weight:500;      font-size:14px ; position: absolute; top: 970px; left: 38px; whiteSpace: nowrap" className=ft11>
                           Name
                        </p>
                        <p style="font-weight:500;      font-size:14px ; position: absolute; top: 990px; left: 646px; whiteSpace: nowrap" className=ft11>
                           Date
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            <br/>
            <div id=page1-div style="font-weight:500; position: relative; width: 770px; height: 1080px;     margin-top:20px; margin: 0% 0%; border: 1px solid gray">
               <div>
                  <div id=page1-div style="font-weight:500; background-color: #e4e3e3; border-bottom: 0px solid gray; display: flex; justify-content: space-between; padding: 5px 0px">
                  
                        <div style="font-weight:500; width: 58%; margin-top: 1%; margin-bottom: 0%">
                        <img width={200} height={65}   src="${logoBase64str}" alt=background image />
                     </div>
                     <div style="font-weight:500;     margin-top: 1%; margin-bottom: 0%">
                        <img width=90% height={62}  src="${addressBase64str}" alt=background image />
                     </div>
                  </div>

                  <div style="width: 100%; height: 200px;" >
                     <div>
                        <p style="font-weight:500; position: absolute; font-size: 14px; top: 125px; left: 68px;  whiteSpace: nowrap" className=ft20><b>Name</b></p>
                        <p style="font-weight:500; position: absolute; font-size: 14px; top: 125px; left: 192px; whiteSpace: nowrap" className=ft20><b>${props.EmpName}</b></p>
                        <p style="font-weight:500; position: absolute; font-size: 14px; top: 154px; left: 68px; whiteSpace: nowrap" className=ft20><b>Designation</b></p>
                        <p style="font-weight:500; position: absolute; font-size: 14px; top: 153px; left: 192px; whiteSpace: nowrap" className=ft20><b>${props.DesignationName}</b></p>
                        <p style="font-weight:500; position: absolute; font-size: 14px; top: 180px; left: 68px; whiteSpace: nowrap" className=ft20><b>Location</b></p>
                        <p style="font-weight:500; position: absolute; font-size: 14px; top: 180px; left: 192px; whiteSpace: nowrap" className=ft20><b>${props.CurrentAddress}</b></p>
                        <p style="font-weight:500; position: absolute; font-size: 14px; top: 210px; left: 68px; whiteSpace: nowrap" className=ft20><b>W.E.F</b></p>
                        <p style="font-weight:500; position: absolute; font-size: 14px; top: 210px; left: 192px; whiteSpace: nowrap" className=ft20><b>${props.ProjectedDOJ}</b></p>
                     </div>
                     <div class="div_table" style="font-weight: 500; width: 93%; display: flex;">
                     <div style="font-weight: 500; width: 50%; margin: 0% 1%;">
                        <table>
                           <tbody>
                              <tr>
                                 <td colspan="2" class="ft21 border_table" style="font-weight: 800; padding-left: 40%; background-color: rgb(221, 221, 221);">Earning</td>
                              </tr>
                          



                            
                              ${EmpEarningData && EmpEarningData.map((item)=>{
                                 return `   <tr class="border_table">
                                 <td class="border_table nth_child ft22" style="font-weight: 600;"> ${item.PayCompName}</td>
                                 <td class="border_table nth_child th_center ft22" style="font-weight: 600;">${item.PayCompValue}</td>       </tr>`}).join("")} 
                        

                              <tr>
                                 <td class="border_table nth_child ft22" style="font-weight: 800;">Total Earning</td>
                                 <td class="border_table nth_child th_center ft22" style="font-weight: 800;">${EmpOfferEarningTotal}</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                     <div style="font-weight: 500; width: 50%; margin: 0% 1%;">
                        <table>
                           <tbody>
                              <tr class="border_table nth_child">
                                 <td colspan="2" class="ft21" style="font-weight: 800; padding-left: 40%; background-color: rgb(221, 221, 221);">Deduction</td>
                              </tr>
                              ${EmpDeduction && EmpDeduction.map((item)=>{    return ` 
                              <tr class="border_table nth_child">
                                 <td class="border_table nth_child ft22" style="font-weight: 600;"> ${item.PayCompCode}</td>
                                 <td class="border_table nth_child th_center ft22" style="font-weight: 600;">${item.PayCompValue}</td>
                                 </tr>`  }).join("")}


                                 
                                    
                              <tr>
                                 <td class="border_table nth_child ft22" style="font-weight: 800;">Total Deduction</td>
                                 <td class="border_table nth_child th_center ft22" style="font-weight: 800;">${EmpDeductionTotal}</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                  </div> <div class="div_table" style="font-weight: 500; width: 93%; margin-top: 15px; display: flex;">
                     <div style="font-weight: 500; width: 100%; margin: 0% 1%;"><table><tbody>

                     ${EmpNetSalary && EmpNetSalary.map((item)=>{
                        return `
                        <tr><td class="border_table nth_child ft22" style="font-weight: 800;">Net Take Home</td>
                        <td class="border_table nth_child th_center ft22" style="font-weight: 800;">${item.NetSalary}</td>          </tr>`  }).join("<br/>")} 
                        </tbody>    </table>
                        </div>
                        </div>

                        <div class="div_table" style="font-weight: 500; width: 93%; display: flex; margin-top"-10px">
                        <div style="font-weight: 500; width: 48%; margin: 0.5% 1%;">
                           <table>
                              <tbody>
                                 <tr class="border_table nth_child">
                                    <td colspan="2" class="ft21" style="font-weight: 800; padding-left: 35%; background-color: rgb(221, 221, 221);">Statutory Benefit</td>
                                 </tr>
                                 ${EmpContribution && EmpContribution.map((item)=>{
                                    return `

                                 <tr class="border_table nth_child">
                                    <td class="border_table nth_child ft22" style="font-weight: 600;">${item. CompName}</td>
                                    <td class="border_table nth_child th_center ft22" style="font-weight: 600;">${item.CompValue}</td>
                                    </tr>`  }).join("<br/>")} 

                                    ${EmpNetSalary && EmpNetSalary.map((item)=>{
                                       return `
                                 <tr class="border_table nth_child">
                                    <td class="border_table nth_child ft22"> <b style="font-weight: 800;">Gross Monthly Salary</b></td>
                                    <td class="border_table nth_child th_center ft22"> <b style="font-weight: 800;">${item.GrossSalary}</b></td>
                                 </tr>`  }).join("<br/>")} 
                              </tbody>
                           </table>
                        </div>
                     </div>
 <div class="div_table" style="font-weight: 500; width: 93%; margin-top: 2px; display: flex;">
                        <div style="font-weight: 500; width: 48%; margin: 0% 1%;">
                           <table style="margin-top: 10px;">
                              <tbody>
                              ${EmpNetSalary && EmpNetSalary.map((item)=>{
                                 return `
                                 <tr><td class="border_table nth_child ft22" style="font-weight: 800;">Cost to the Company</td>
                                 <td class="border_table nth_child th_center ft22" style="font-weight: 800;">${item.Mctc}</td>   </tr>  <tr>
                                 <td class="border_table nth_child ft22"><b style="font-weight: 800;">Annual Cost to the Company</b></td>
                                 <td class="border_table nth_child th_center ft22"><b style="font-weight: 800;">${item.Yctc}</b></td>
                              </tr>`  }).join("<br/>")} 
                             
                                
                              </tbody>
                           </table>
                           <table style="margin-top: 10px;">
                              <tbody style="margin-top: 10px;">
                             
                              ${EarningOthers && EarningOthers.map((item)=>{
                                 return `
                                 <tr >
                                    <td sty class="border_table nth_child ft22" style="margin-top: 20px;"><b style="font-weight: 800; ">${item.PayCompName}</b></td>
                                    <td class="border_table nth_child th_center ft22"><b style="font-weight: 800;">${item.PayCompValue}</b></td>
                                 </tr>`  }).join("<br/>")} 
                                 
                              </tbody>
                           </table>
                        </div>
                     </div>
                  
                     

                     <div style="font-weight:500; width:100%; position: absolute; bottom: 100px; ">

                     <div style="font-weight:500; width:100%; margin-left:40px">
                        <img style="font-weight:500;width: 206px; background-color: rgb(211; 211; 211)" width={140} height={53}    src="${signatureBase64str}"alt=background image />
                     </div>
                     <div style="width:100% ; display: flex;">
                     <div style="width:70%; margin-left: 40px;">
                     <p style="font-weight:500"; className=ft20>
                     <b style="font-weight:700 ; margin-left: 35px;">Sheetal Mahajan</b>
                  </p>
                  <p style="font-weight:500;" >
                     Deputy General Manager – HR
                  </p>
                     </div>
                     <div style="width:30%">
                         <p style="font-weight:500"; className=ft20>
                             <b style="font-weight:700 ;margin-left: 35px">${props.EmpName}</b>
                          </p>
                          <p style="font-weight:500" >
                          Employee Signature
                          </p>
                     </div>
                     </div>
                     </div>


                    
                     
                  </div>
               </div>
            </div>
         </div>
      </div>
      </div>
   </body>
</html>
    `

    return res
}
