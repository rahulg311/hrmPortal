// const fs = require('fs');
import fs from 'fs';
import path from 'path';
import { PDFBASEPATH } from './Api';


export default async function (props,empDocList) { 
    // var paths=path.join("../HRM_Images/offer_letter_logo.png", "../")
    // console.log("path------",__dirname)

    // empDocList.map((item)=> console.log("item.DocName-------",item.DocName))
  

    var logoBase64str = base64_encode(`${PDFBASEPATH}/pages/HRM_Images/offer_letter_logo.png`);
    var addressBase64str = base64_encode(`${PDFBASEPATH}/pages/HRM_Images/address.png`);
    var signatureBase64str = base64_encode(`${PDFBASEPATH}/pages/HRM_Images/Signature_DGM_HR.jpg`);

  
    function base64_encode(file) {
        return "data:image/png;base64,"+fs.readFileSync(file, 'base64');
    }

    console.log("props---",props)
    let res= `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title></title>
        <br />
        <style type="text/css">
            p {margin: 0; padding: 0;}	.ft10{font-size:13px;font-family:Times;color:#000000;}
            .ft11{font-size:13px;font-family:Times;color:#000000;}
            .ft12{font-size:14px;font-family:Times;color:#000000;}
            .ft13{font-size:13px;line-height:18px;font-family:Times;color:#000000;}
            .ft14{font-size:13px;line-height:26px;font-family:Times;color:#000000;}
            .ft15{font-size:13px;line-height:27px;font-family:Times;color:#000000;}
            .ft16{font-size:13px;line-height:21px;font-family:Times;color:#000000;}
            .ft17{font-size:13px;line-height:21px;font-family:Times;color:#000000;}
         
        </style>
        <style>
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
        <div
          id="page1-div"
          style="position: relative; width: 750px; height: 1080px; margin: 0% 2% ;border: 1px solid gray;"
        >
        <div>
        
            <div  id="page1-div"   style=" background-color: #e4e3e3 ;border-bottom: 0px solid gray; display:flex; justify-content: space-between;padding: 5px 0px; border-right: 1px solid gray;  width: 100%; ">
                <div  style="margin-top: 1%; margin-bottom: 0%; " >
                    <img
                        width="200"
                        height="65"
                        src="${logoBase64str}"
                        alt="background image"
                    />
                </div>
                <div style=" margin-top: 1%; margin-bottom: 0%; " >
                    <img
                        width="90%"
                        height="62"
                        src="${addressBase64str}"
                        alt="background image"
                    />
                </div>
            </div>
            <div style=" background-color: rgb(238, 237, 237) ;border-bottom: 1px solid gray; height: 20px;  width: 100%; border-right: 1px solid gray;">
                
            </div>
    
            <div style="position: absolute; top: -60px; left: 10px; white-space: nowrap">
          <p
            style="position: absolute; top: 190px; left: 38px; white-space: nowrap"
            class="ft10"
          >
            <b>Date:</b>
          </p>
         
          <p
            style="position: absolute; top: 190px; left: 112px; white-space: nowrap"
            class="ft10"
          >
            <b>17-07-2023</b>
          </p>
          <p
            style="position: absolute; top: 328px; left: 38px; white-space: nowrap"
            class="ft11"
          >
            We are pleased to make an offer to you on behalf of CPM India Sales
            &amp; Marketing Pvt Ltd.&#160;
          </p>
          <p
            style="position: absolute; top: 475px; left: 70px; white-space: nowrap"
            class="ft11"
          >
            Your appointment will be subject to your furnishing the following
            documents and verification&#160;<br />of the same
          </p>
         
          <p
            style="position: absolute; top: 520px; left: 69px; white-space: nowrap"
            class="ft11"
          >
          ${empDocList && empDocList.map((item)=>{
             return item.DocName }).join("<br/>")} 
          </p>
          <p
            style="position: absolute; top: 678px; left: 69px; white-space: nowrap"
            class="ft11"
          >
            Kindly sign and return the duplicate copy of this letter.
          </p>

          <div  style="position: absolute; top: 795px; left: 32px;" >
            <img
            style=" background-color: rgb(211, 211, 211) ; "
                width="140"
                height="53"
                src="${signatureBase64str}"
                alt="background image"
            />
        </div>
          <p
            style="position: absolute; top: 853px; left: 38px; white-space: nowrap"
            class="ft13"
          >
            With best wishes&#160;<br />For CPM India Sales &amp; Marketing Pvt Ltd.
          </p>
          <p
            style="position: absolute; top: 958px; left: 38px; white-space: nowrap"
            class="ft16"
          >
            Acceptance of the offer letter:<br />I will be able to join from
          </p>
          <p
            style="position: absolute; top: 982px; left: 646px; white-space: nowrap"
            class="ft11"
          >
            Signature
          </p>
          <p
            style="position: absolute; top: 1015px; left: 38px; white-space: nowrap"
            class="ft11"
          >
            Name
          </p>
          <p
            style="
              position: absolute;
              top: 1015px;
              left: 646px;
              white-space: nowrap;
            "
            class="ft11"
          >
            Date
          </p>
          <p
            style="position: absolute; top: 220px; left: 38px; white-space: nowrap"
            class="ft12"
          >
            <b>${props.EmpName}</b>
          </p>
          <p
            style="position: absolute; top: 243px; left: 38px; white-space: nowrap"
            class="ft11"
          >
          ${props.CurrentAddress} ${props.CurrentCity} ${props.CurState} ${props.CurrentPincode}
          </p>
          <p
            style="position: absolute; top: 275px; left: 38px; white-space: nowrap"
            class="ft17"
          >
            Re : Offer for the post of&#160;<b>In Store Promoter<br /></b
            >Dear&#160;<b>${props.EmpName},</b>
          </p>
          <p
            style="position: absolute; top: 701px; left: 69px; white-space: nowrap"
            class="ft11"
          >
            We expect you to join your duties on&#160;<b>${props.ProjectedDOJ}</b>
          </p>
          <p
            style="position: absolute; top: 356px; left: 38px; white-space: nowrap"
            class="ft11"
          >
            for the position of&#160;<b>In ${props.DesignationName} at ${props.DeployLocation}</b>
          </p>
          <p
            style="position: absolute; top: 389px; left: 38px; white-space: nowrap"
            class="ft11"
          >
            The Position carries CTC salary of Rs.&#160;<b>209316.00 Per Annum.</b>
          </p>
          <p
            style="position: absolute; top: 421px; left: 38px; white-space: nowrap"
            class="ft13"
          >
            In event of your resignation or termination of services, either side
            will have to give&#160;<b>${props.NoticePeriod} days</b><br />notice or salary in lieu thereof. &#160;
          </p>
          </div>
           </div>
         
        </div>
    </div>
      </body>
    </html>
    
    
    
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
      <head>
        <title></title>
    
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <br />
        <style type="text/css">
          
              p {margin: 0; padding: 0;}	.ft20{font-size:13px;font-family:Times;color:#000000;}
              .ft21{font-size:16px;font-family:Times;color:#000000;}
              .ft22{font-size:13px;font-family:Times;color:#000000;}
   
        </style>
      </head>
      <body bgcolor="#A0A0A0" vlink="blue" link="blue">
        <div
          id="page1-div"
          style="position: relative; width: 750px; height: 1080px; margin: 0% 2% ;border: 1px solid gray;"
          >
          <div>
          
              <div  id="page1-div"   style=" background-color: #e4e3e3 ;border-bottom: 0px solid gray; display:flex; justify-content: space-between;padding: 5px 0px;  border-right: 1px solid gray;  width: 100%; ">
                  <div  style="margin-top: 1%; margin-bottom: 0%; " >
                      <img
                          width="200"
                          height="65"
                          src="${logoBase64str}"
                          alt="background image"
                      />
                  </div>
                  <div style=" margin-top: 1%; margin-bottom: 0%; " >
                      <img
                          width="90%"
                          height="62"
                          src="${addressBase64str}"
                          alt="background image"
                      />
                  </div>
              </div>
              <div style=" background-color: rgb(238, 237, 237) ;border-bottom: 1px solid gray; height: 20px;  width: 100%; border-right: 1px solid gray;">
                  
              </div>
            <div style="margin: 0% 0%;">
                <p style="position:absolute;top:125px;left:68px;white-space:nowrap" class="ft20"><b>Name</b></p>
                <p style="position:absolute;top:125px;left:192px;white-space:nowrap" class="ft20"><b>Debprosad &#160;Ghorami</b></p>
                <p style="position:absolute;top:154px;left:68px;white-space:nowrap" class="ft20"><b>Designation</b></p>
                <p style="position:absolute;top:153px;left:192px;white-space:nowrap" class="ft20"><b>In Store Promoter</b></p>
                <p style="position:absolute;top:180px;left:68px;white-space:nowrap" class="ft20"><b>Location</b></p>
                <p style="position:absolute;top:180px;left:192px;white-space:nowrap" class="ft20"><b>Kolkata</b></p>
                <p style="position:absolute;top:210px;left:68px;white-space:nowrap" class="ft20"><b>W.E.F</b></p>
                <p style="position:absolute;top:210px;left:192px;white-space:nowrap" class="ft20"><b>17/07/2023</b></p>
            </div>
            <div style="marginTop:-20px"}} >
          <div style="width: 93%; display: flex;" class="div_table">
            <div style="width: 50%;  margin: 0% 1%;">
                <table>
                    <tr>
                      <th style="padding-left: 40%;" colspan="2"  class="ft21">Earning</th>
                    </tr>
                    <tr>
                      <td class="ft22" > Basic</td>
                      <td class="th_center ft22">10763.00</td>
                     
                    </tr>
                    <tr>
                      <td class="ft22">HRA</td>
                      <td class="th_center ft22" >3879.00</td>
                 
                    </tr>
                    <tr>
                      <td class="ft22">Stat Bonus</td>
                      <td class="th_center ft22">897.00</td>
                    
                    </tr>
                    <tr>
                      <td class="ft22"> <b>Gross Monthly Salary</b></td>
                      <td class="th_center ft22"> <b>15539.00</b></td>
                    </tr>
                  </table>
            </div>
            <div style="width: 50%; margin: 0% 1%;">
                <table>
                    <tr>
                      <th colspan="2" style="padding-left: 40%;"  class="ft21">Deduction</th>
                    </tr>
                    <tr>
                      <td  class="ft22">PF</td>
                      <td class="th_center  ft22">1292.00</td>
                     
                    </tr>
                    <tr>
                      <td class="ft22">ESI</td>
                      <td class="th_center ft22">117.00</td>
                 
                    </tr>
                    <tr>
                      <td class="ft22">PTAX</td>
                      <td class="th_center ft22">130.00</td>
                    </tr>
                    
                  </table>
            </div>
          </div>
    
          <div style="width: 93%; margin-top: 2px;display: flex;" class="div_table">
            <div style="width: 100%;  margin: 0% 1%;">
                <table >
                    <tr>
                      <td class="ft22" ><b>Net Take Home</b></td>
                      <td class="th_center ft22" style="width: 14.5%;"><b>14000.00</b></td>
                    </tr>
                    
                  </table>
            </div>       
    
          </div>
    
          <div style="width: 93%; display: flex;" class="div_table">
            <div style="width: 48%;  margin: 0.5% 1%;">
                <table>
                    <tr>
                      <th style="padding-left: 40%;" colspan="2" class="ft21">Statutory Benefit</th>
                    </tr>
                    <tr>
                      <td class="ft22">Provident Fund(Employer share)</td>
                      <td class="th_center ft22">1399.00</td>
                     
                    </tr>
                    <tr>
                      <td class="ft22">ESI(Employer share)</td>
                      <td class="th_center ft22" >505.00</td>
                    </tr>
                    <tr>
                      <td class="ft22">Sub Total </td>
                      <td class="th_center ft22">1904.00</td>
                    
                    </tr>
                    <tr>
                      <td class="ft22"> <b>Gross Monthly Salary</b></td>
                      <td class="th_center ft22"> <b>15539.00</b></td>
                    </tr>
                  </table>
            </div>
            
          </div>
    
          <div style="width: 93%; margin-top: 2px;display: flex;" class="div_table">
            <div style="width: 48%;  margin: 0% 1%;">
                <table >
                    <tr>
                      <td class="ft22"><b>Cost to the Company</b></td>
                      <td class="th_center ft22"><b>17443.00</b></td>
                    </tr>
                    <tr>
                        <td class="ft22" ><b>Annual Cost to the Company</b></td>
                        <td class="th_center ft22"><b>209316.00</b></td>
                    </tr>
                    
                  </table>
            </div>       
          </div>
            <div  style="position: absolute; top: 859px; left: 49px;" >
                <img
                style=" background-color: rgb(211, 211, 211) ; "
                    width="140"
                    height="53"
                    src="${signatureBase64str}"
                    alt="background image"
                />
            </div>
    
    
          <p
            style="position: absolute; top: 920px; left: 87px; white-space: nowrap"
            class="ft20"
          >
            <b>Sheetal Mahajan</b>
          </p>
          <p
            style="position: absolute; top: 952px; left: 67px; white-space: nowrap"
            class="ft22"
          >
            Deputy General Manager – HR
          </p>
          <p
            style="position: absolute; top: 918px; left: 572px; white-space: nowrap"
            class="ft20"
          >
            <b>Debprosad &#160;Ghorami</b>
          </p>
          <p
            style="position: absolute; top: 952px; left: 582px; white-space: nowrap"
            class="ft22"
          >
            Employee Signature
          </p>
        </div>
      </body>
    </html>
    `

return res
}
