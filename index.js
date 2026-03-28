// Import stylesheets
import './style.css';

// 14.2. Is mobile ?
import { isMobile } from './script.js';

// Body element
const body = document.querySelector('#body');

// Environment elements
const os = document.querySelector('#os');
const appLanguage = document.querySelector('#appLanguage');
const sdkVersion = document.querySelector('#sdkVersion');
const lineVersion = document.querySelector('#lineVersion');
const isInClient = document.querySelector('#isInClient');
const isLoggedIn = document.querySelector('#isLoggedIn');
const type = document.querySelector('#type');

// Profile elements
const email = document.querySelector('#email');
const userId = document.querySelector('#userId');
const pictureUrl = document.querySelector('#pictureUrl');
const displayName = document.querySelector('#displayName');
const statusMessage = document.querySelector('#statusMessage');

// Message elements
const btnSend = document.querySelector('#btnSend');
const btnShare = document.querySelector('#btnShare');

// Window elements
const btnOpenWindow = document.querySelector('#btnOpenWindow');
const btnCloseWindow = document.querySelector('#btnCloseWindow');

// QR elements
const qrCode = document.querySelector('#qrCode');
const btnScanCode = document.querySelector('#btnScanCode');

// Shortcut element
const btnShortcut = document.querySelector('#btnShortcut');

// Friendship element
const friendship = document.querySelector('#friendship');

// Authentication elements
const accessToken = document.querySelector('#accessToken');
const idToken = document.querySelector('#idToken');
const btnLogIn = document.querySelector('#btnLogIn');
const btnLogOut = document.querySelector('#btnLogOut');

// Service Message elements
const serviceMessage = document.querySelector('#serviceMessage');
const btnServiceMessage = document.querySelector('#btnServiceMessage');

// 1.1. Specify your LIFF ID
// LINE developers > mini-app >Web app settings
// LIFF URL > Developing
const liffId = 'YOUR_LIFF_ID';

async function main() {
  devinfo.append(' วรเพชร , Latest Build: 6903-28 12:30');
  //Warning :: Free plan
  serviceMessage.innerHTML = `Warning: Google Firebase Cloud</br>ต้องเป็นแผน Pay-as-you-go (Blaze plan) เท่านั้น</br>กรุณาอัพเดต จะสามารถส่ง Service Messages ได้`;

  // 1.2. Initialize LIFF SDK
  await liff.init({ liffId });

  // 2.2. Call getEnviroment();
  getEnviroment();

  // 2.3. Try a function
  switch (liff.getOS()) {
    case 'android':
      body.style.backgroundColor = '#E3FEFF';
      break;
    case 'ios':
      body.style.backgroundColor = '#eeeeee';
      break;
    default:
      body.style.backgroundColor = '#E3FFF1';
  }

  // 3.2. Call getUserProfile();
  //Off - getUserProfile();

  // 5. Is in LINE client ?
  if (liff.isInClient()) {
    getUserProfile();

    //9.3 display send Message Button
    btnSend.style.display = 'block';

    // 10.3 display Button all case in manageViewForLoggedInUser();
    manageViewForLoggedInUser();

    // 15.2 call getFriendship
    getFriendship();

    // 16.2
    getAuthentication();
  } else {
    // 18. Bonus: Servive In-App browser
    if (isMobile()) {
      window.location.replace(`line://app/${liffId}`);
      setTimeout(() => {
        window.close();
      }, '5000');

      return;
    }

    // LoggedIn ?
    if (isLoggedIn) {
      btnLogOut.style.display = 'none';
      btnLogOut.style.display = 'block';

      getUserProfile();

      // 10.3 display Button all case in manageViewForLoggedInUser();
      manageViewForLoggedInUser();

      // 15.2 call getFriendship
      getFriendship();

      // 16.2
      getAuthentication();
    } else {
      btnLogOut.style.display = 'block';
      btnLogOut.style.display = 'none';
    }
  }
  // 12.2
  btnOpenWindow.style.display = 'block';

  // 13.2
  btnCloseWindow.style.display = 'block';
}

main();

function getEnviroment() {
  // 2.1. Get environment info
  os.append(liff.getOS());

  appLanguage.append(liff.getAppLanguage());
  sdkVersion.append(liff.getVersion());
  lineVersion.append(liff.getLineVersion());
  isInClient.append(liff.isInClient());
  isLoggedIn.append(liff.isLoggedIn());

  // utou > One : One > Private Chat
  //
  type.append(liff.getContext().type);
}

async function getUserProfile() {
  // 3.1. Get basic profile
  const profile = await liff.getProfile();
  pictureUrl.src = profile.pictureUrl;
  userId.append(profile.userId);
  displayName.append(profile.displayName);
  statusMessage.append(profile.statusMessage);

  // 4. Get email
  email.append(liff.getDecodedIDToken().email);
}

function manageViewForLoggedInUser() {
  // 10.2. Display share messages button
  btnShare.style.display = 'block';

  // 11.2. Display QR code button
  btnScanCode.style.display = 'block';

  // 14.3. Display add shortcut button"
  if (isMobile()) {
    btnShortcut.style.display = 'block';
  }

  // 17.2. Display service message button
}

btnLogIn.onclick = () => {
  // 7. Perform login
  liff.login();
};

btnLogOut.onclick = () => {
  // 8. Perform logout
  liff.logout();
  window.location.reload();
};

btnSend.onclick = async () => {
  // 9.1. Check context
  if (!['none', 'external'].includes(liff.getContext()).type) {
    await liff.sendMessages([
      {
        type: 'sticker',
        packageId: '1',
        stickerId: '1',
      },
      {
        type: 'text',
        text: 'สวัสดี This message was send by liff.sendMessages()',
      },
    ]);

    alert('message sent');
  }
};

btnShare.onclick = async () => {
  // 10.1. Share messages
  await liff.shareTargetPicker([
    {
      type: 'flex',
      altText: 'This message was shared by shareTargetPicker()',
      contents: {
        type: 'bubble',
        hero: {
          type: 'image',
          url: 'https://vos.line-scdn.net/imgs/apis/ic_mini.png',
          aspectRatio: '1:1',
          size: 'full',
        },
      },
    },
  ]);
};

btnScanCode.onclick = async () => {
  // 11.1. QR code reader
  const result = await liff.scanCodeV2();
  qrCode.append(result.value);
};

btnOpenWindow.onclick = () => {
  // 12.1. Open window
  liff.openWindow({
    url: 'https://linedevth.line.me',
    external: true,
  });
};

btnCloseWindow.onclick = () => {
  // 13.1. Close window
  liff.closeWindow();
};

btnShortcut.onclick = async () => {
  // 14.1. Add shortcut (Verified MINI App)
  await liff.createShortcutOnHomeScreen({
    url: `https://miniapp.line.me/${liffId}`,
  });
};

async function getFriendship() {
  // 15.1. Get friendship
  let msg = 'คุณเป็นเพื่อนกับ Bot แล้ว';
  const friend = await liff.getFriendship();
  if (!friend.friendFlag) {
    // Bot ที่เราต้องการให้ ติดตาม/เป็นเพื่อน
    const botId = '@qan4856i'; // Bot-Chat-AI
    msg = `ยังไม่ได้เป็นเพื่อนกับ Chatbot</br><a href="https://line.me/R/ti/p/${botId}">กดติดตาม Chatbot ได้เลย</a>`;
  }
  friendship.innerHTML = msg;
}

function getAuthentication() {
  // 16.1. Get authentication info
  accessToken.append(liff.getAccessToken());
  idToken.append(liff.getIDToken());
}

btnServiceMessage.onclick = async () => {
  // 17.1. Request Service Message API
  const url = 'URL'; // from Firebase Cloud functions
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ liffAccessToken: liff.getAccessToken() }),
  });
  const data = await response.json();
  serviceMessage.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  alert('Message sent successfully!');
};
