import {useEffect, useRef, useState } from "react";
import { BASE_PREFIX } from "../../../module/myconstants";
import request from "../../../module/services/request.service";
import { toDecimalLimit, toFloorDecimals, toLocale } from "../../../module/utils/calculate.util";
import { toFormData } from "../../../module/utils/convert.util";
import { getLocaleObject,getLocaleContent } from "../../../module/utils/language.util";
import { is_empty } from "../../../module/utils/misc.util";
import StorageService from "../../../module/services/storage.service";



export default function MyPageAuth({userInfo}) {

  const [password, setPassWord] = useState("");
  const [otpNm, setOtpNm] = useState("");
  const [otpKey, setOtpKey] = useState("");
  const otpQR = useRef(null)


  const level = userInfo.info.authLevel;
    const [selectLevel, setSelectLevel] = useState(level)
  
  const handleSelect = (e,curLevel) => {
    console.log("handleSelect", curLevel)
    
     if (curLevel == 2) {
    console.log("scrollIntoView", otpQR.current)
        otpQR.current.scrollIntoView({ behavior: 'smooth' });
     }

    if(level >= curLevel || (level + 1) === curLevel){
        e.preventDefault();
        setSelectLevel(curLevel);
    }
     else{
        setSelectLevel(level);
     }

  }
 
  var sBrowser, sUsrAg = navigator.userAgent;

  if (new StorageService().language.get() == undefined) {
        new StorageService().language.set('ko')
    }
    const [locale, setLocale] = useState(new StorageService().language.get());

  //console.log("=>>>>>>UserInfo", userInfo)
 

    const handleOtpQrCode = otpcode => {
        const searchParams = {chs: '100x100', cht: 'qr', chld: 'M|0', chl: otpcode, choe: 'UTF-8'}
        return `https://chart.googleapis.com/chart${'?'}${new URLSearchParams(searchParams).toString()}`
    }
  
    if (sUsrAg.indexOf("Edge") > -1) {
         sBrowser = "Microsoft Edge";
 
    } else if (sUsrAg.indexOf("Chrome") > -1) {
    sBrowser = "Google Chrome";
 
    }
    
    var detectedOS = "Unknown OS";

    if (navigator.appVersion.indexOf("Mac") != -1) 
    detectedOS = "MacOS";

    if (navigator.appVersion.indexOf("Win") != -1) 
    detectedOS = "Windows";

    if (navigator.appVersion.indexOf("Linux") != -1) 
    detectedOS = "Linux";

   const handleSubmit = (e) =>{
        e.preventDefault();

      var userId = userInfo.info.userId;
            console.log(e.target);

            if( otpNm.length!==6 ) {
                alert("opt ???????????? ?????????????????????. ")
        setOtpNm("")
            } else {
                
                _handleOtpSubmit();
            }
   }
   
  
        
  const _handleOtpSubmit = async () => {

    // ???????????? ?????? 
    var param = { 
      loginPwd : password, 
      otpAuthCd : otpNm, 
      otpAuthKey : userInfo.newOtpKey, os : detectedOS, browser: detectedOS, 
      userId : userInfo.info.userId }
      const rsp = await request.post(BASE_PREFIX+ '/mypage/mpg002/requestOtpAuth2', toFormData(param)).then(response => response.data)
      if (rsp.rtnCd == 0) {
        lrt.client( "Suceed registration", "OTP ????????? ?????????????????????.", function () { location.href = "/site/info"; }, null);
      } else {
        lrt.client( "Failed to registraion", rsp.rtnMsg, function () {  }, null);
      }
                
    }
    
    useEffect(()=>{
    setOtpKey(userInfo.newOtpKey)
    }, [])


    return (
        
    <>
     <li id="vtab2" style={{display: 'list-item'}}>
        <h1 className="subtitle">{getLocaleContent('word', 'auth_center')}</h1>
        <p className="mylevel">
          <span>{getLocaleContent('word', 'content_level')}</span>
          <span className="blue"> {getLocaleContent('word', 'level')}{userInfo.info.authLevel} </span>
          <span>{getLocaleContent('word', 'content_level_ex')}</span>
        </p>
        {
          locale === "ko" ? <p><span className="blue">????????? ???????????????</span> ???????????? ??????????????? ???????????????.</p> : 
          (locale === "en" ? <p>When you,<span className="blue">verify your mobile phone identity</span> the withdrawal limit for cryptocurrency will be increased.</p> : 
          <p>quando voc?? <span className="blue">verificar a identidade do seu celular</span>, o limite de retirada de criptomoedas ser?? aumentado.</p>
          )
        }

        <dl className="level">
        {
            getLocaleObject('account.level.list').map((item, index) => {
              return <dt className={`${userInfo.info.authLevel === (index + 1) ? "now" : (userInfo.info.authLevel === index ? "able" : "impossble")} levellink`}>
                        <p className="blue">{getLocaleContent('word', 'level')}{(index+1)}</p>
                        <p>{item.name}</p>
                        <p><img src={`/resources/img/yaho/level${(index + 1)}.png`} alt={`level${(index + 1)}`} /></p>
                        {
                          index === 0 ? <><p>{userInfo.info.userId}</p></>:
                          <>
                            <p>{item.name_txt}</p>
                            <button type="button" className={`${userInfo.info.authLevel === (index + 1) ? "btnMobile" : (userInfo.info.authLevel === index ? "btnMobile" : "gray")}`} onClick={(e)=>handleSelect(e,index+1)}>{item.btn}</button>
                          </>
                        }
                      </dt>
            })
          }

          {/* <dt className="now levellink" onclick="openPage('level1')">
            <p className={userInfo.info.authLevel == 2 ? 'blue' : 'gray'}>??????2</p>
            <p>????????? ??????</p>
            <p><img src="/resources/img/yaho/level1.png" alt="level1" /></p>
            <p>{userInfo.info.userId}</p>
          </dt> */}
                    {/* ???????????? 1??????  : - sms?????? ????????????   */}

                    {/* <dd className={`${userInfo.info.authLevel === 2 ? "now" : "impossble"} levellink`} onclick="openPage('level2')">
            <p>??????2 </p>
                        <p><img src="/resources/img/yaho/level2.png" alt="level2" /></p>
            <p>????????? ????????? ???????????????.</p>
          </dd> */}
          {/* <dd className={`${userInfo.info.authLevel === 3 ? "now" : "able"} levellink`}>
            <p className={userInfo.info.authLevel == 3 ? 'blue' : 'gray'}>??????3</p>
            <p>???????????? ??????</p>
            <p><img src="/resources/img/yaho/level3.png" alt="level3" /></p>
            <p>OTP ??????</p>
            <button className="gray" onClick={handleSubmit}>????????????</button>
          </dd>
          <dd className={`${userInfo.info.authLevel === 4 ? "now" : "impossble"} levellink`}>
            <p className={userInfo.info.authLevel == 4 ? 'blue' : 'gray'}>??????4</p>
            <p>????????????</p>
            <p><img src="/resources/img/yaho/level4.png" alt="level4" /></p>
            <p>???????????? ??????</p>
            <button className="gray">????????????</button>
          </dd>
          <dd className={`${userInfo.info.authLevel === 5 ? "now" : "impossble"} levellink`}>
            <p className={userInfo.info.authLevel == 5 ? 'blue' : 'gray'}>??????5</p>
            <p>???????????????</p>
            <p><img src="/resources/img/yaho/level5.png" alt="level5" /></p>
            <p>???????????? ??????</p>
            <button className="gray">??????4 ??????</button> 
          </dd> */}
        </dl>
        <div id="level1" className="leveinfo" style={{display: (selectLevel === 1 ? "block" : "none")}}>
          <h3>????????? ??????</h3>
          <p>??????????????? ??????1 ????????? ????????? ?????? ?????????.</p>
        </div>
        {/* <div id="level2" className="leveinfo" style={{display : 'none'}}>
          <div>
            <h3>????????? ??????</h3>
            <span>?????? ????????? ??????????????? ??????, ????????????, ??????, ??????????????? ???????????????.</span>
            <button className="blue big btnMobile"> ????????????</button>
          </div>
        </div> */}
        {/*???????????? otp ??????   style={{display: 'none'}} ?????????  */}
        <div id="level2" className="leveinfo" style={{display: (selectLevel === 2 ? "block" : "none")}}>
          <h3>{getLocaleContent('word', 'mypage_tit')}</h3>
          <p>- {getLocaleContent('word', 'mypage_txt')}</p>
          <div className="mgt20">
            <h1> 1. {getLocaleContent('word', 'mypage_tit1')}</h1>
            <p>{getLocaleContent('word', 'mypage_txt1')}</p>
            <div className="mgt20">
              <img src="/resources/img/yaho/img-google.jpg" />
              <img src="/resources/img/yaho/img-apple.jpg" />
            </div>
          </div>

          <div  className="mgt20" ref={otpQR}  >
            <h1> 22. {getLocaleContent('word', 'mypage_tit2')}</h1>
            <p id="vtab2-level4-otp-key-setting-text">{getLocaleContent('word', 'mypage_tit2')}</p> 
            <div className="my-key">
              <span id="vtab2-level4-otp-qrcode"  title={userInfo.googleOtpKey} className="my-key-qr" >
                <canvas width={100} height={100} style={{display: 'none'}} />
                <img src={handleOtpQrCode(userInfo.googleOtpKey)} style={{display: 'block'}} />
              </span>
            </div>
            <div className="my-key-txt">
              <span> {/*  qr ????????? ????????????.  */}
                <span id="vtab2-level4-otp-key-intro-text">{getLocaleContent('word', 'mypage_intro')}<br />
                <span id="vtab2-level4-otp-auth-key">{userInfo.newOtpKey}</span>
                </span>
              </span>
            </div>
          </div>
          <div id="vtab2-level4-otp-auth-div" className="mgt20">
            <h1>3. {getLocaleContent('word', 'mypage_tit3')}</h1>
            <p>{getLocaleContent('word', 'mypage_txt3')}</p>
            <table className="type01 mgt20">
              <colgroup>
                <col style={{width: '200px'}} />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>{getLocaleContent('word', 'mypage_log')}</th>
                  <td><input type="password" id="vtab2-level4-login-password" onChange={e=>{setPassWord(e.target.value)}} value={password} name className="basic" placeholder=""  /></td>
                </tr>
                { /*  
                                <tr>
                  <th>????????? SMS ??????</th>
                  <td>
                    <input type="text" id="vtab2-level4-sms-auth-code" name placeholder="???????????? ????????? SMS??? ?????? ??????????????? ???????????????" />
                    <button id="vtab2-level4-sms-auth-code-request-btn">???????????? ??????</button>
                  </td>
                </tr>

                                */}
                                
                <tr>
                  <th>{getLocaleContent('word', 'mypage_otp')}</th>
                  <td><input type="text" id="vtab2-level4-otp-auth-code" value={otpNm} onChange={e=>{setOtpNm(e.target.value)}} placeholder={getLocaleContent('word', 'mypage_place')} /></td>
                </tr>
                        
              </tbody>
            </table>
                            <div class="btn-wrap mgt20">
                                <button id="vtab2-level4-auth-request-btn" class="big blue" onClick={handleSubmit}>{getLocaleContent('word', 'mypage_btn')}</button>
                            </div>
          </div>
        </div>
        {/*???????????? otp ???*/}
        {/*??????????????? ??????*/}
        <div id="level3" className="leveinfo" style={{display: (selectLevel === 3 ? "block" : "none")}}>
          <form id="authSubmit">
            {/*??????????????? ??????*/}
            <h3>?????? ????????? ??????</h3>
            {/*??????????????? ???*/}
          </form>
        </div>
        {/*??????????????? ??????*/}
        <div id="level4" className="leveinfo" style={{display: (selectLevel === 4 ? "block" : "none")}} >
          <div>
            <p style={{color: 'red'}} />
            <h3>????????? ??????</h3>
            <p>- ????????? ???????????? ??????????????????, ??????????????????, ????????????, ??????????????????, ????????????????????? ??? ???1 ?????? ???????????? ?????????.</p>
            <p>- ????????? ???????????? ?????????????????? 3?????? ????????? ???????????? ???????????????</p>
            <p>- ????????? ?????? ???, ???????????? ????????? ???????????????.</p>
            {/*<button class="blue big"> ??????5 ?????? ??????</button>*/}
          </div>
        </div>
        {/*??????????????? ???*/}
      </li>
    </>
    );
}
