const test = 'This is a text';
//this is test bellow
let myData;
let currDisplayedData;
let dropdownForSearch = document.querySelector('.search-displayer')
let main = document.querySelector('.email');
let tabs = document.querySelector('.tab');
let tabsBorder = document.querySelectorAll('.bottom');
let social;
let promotions;
let updates;
let searchedResult = {};
const searchBar = document.querySelector('#search')

for (let i = 0; i < tabs.children.length; i++) {
  tabs.children[i].setAttribute('area-label', tabs.children[i].innerText);
  tabsBorder[i].setAttribute('area-label', tabs.children[i].innerText);
}

fetch('https://polar-reaches-49806.herokuapp.com/api?page=1&category=primary')
  .then((response) => response.json())
  .then((data) => {
    onReady(data);
  })
  .catch((error) => {
    console.log(error);
  });

function onReady(fetchedData) {
  myData = fetchedData;
  myData = addIdToData(myData);
  social = toSocial(myData);
  promotions = toPromotions(myData);
  updates = toUpdates(myData);
  listAllEmails(myData);
  tabs.children[0].click()
}

//event Listener on tabs
tabs.addEventListener('click', tabsClicked);
function tabsClicked(e) {
  if (e.target.nodeName !== 'DIV') return;
  let curr = e.target;
  for (let i = 0; i < tabsBorder.length; i++) {
    tabsBorder[i];
    tabs.children[i].removeAttribute('style');
    if (tabsBorder[i].classList.contains('tabs')) {
      tabsBorder[i].classList.remove('tabs');
    }
    tabsBorder[i].style.backgroundColor = 'transparent';
  }
  curr.children[1].classList.add('tabs');
  curr.style.color = tabsColor(curr);
  curr.children[1].style.backgroundColor = tabsColor(curr);
  listAllEmails(detectWhichTab(curr));
}

// HELPER FUNCTION ADDED NEW
function detectWhichTab(e) {
  let target = e.getAttribute('area-label');
  let subData;
  switch (target) {
    case 'Social':
      subData = social;
      break;
    case 'Promotions':
      subData = promotions;
      break;
    case 'Updates':
      subData = updates;
      break;
    default:
      subData = myData;
  }
  return subData;
}

// HELPER FUNCTION ADDED NEW
function removeAllFromDom() {
  main = document.querySelector('.email');
  while (!main.lastElementChild.hasAttribute('status')) {
    main.removeChild(main.lastElementChild);
  }
}

//HELPER FUNCTION ADDED NEW
function tabsColor(curr) {
  /// loop tabs ad remove active class
  curr.classList.add('active');
  let current = curr.getAttribute('area-label') 
  return current == 'Primary'
    ? '#D93025'
    : current == 'Social'
    ? '#1A73E8'
    : current == 'Promotions'
    ? '#188038'
    : '#DD7607'; //then it's gotta be updates
}

function listAllEmails(data) {
  currDisplayedData = data;
  removeAllFromDom();
  let list = document.querySelector('[status="template"]');

  for (let i = 0; i < 20; i++) {
    let anEmail = list.cloneNode(true);
    anEmail.style.display = 'block';
    anEmail.removeAttribute('status');

    if (!data.items[i].isRead) {
      anEmail.classList.add('unread');
    } else if (data.items[i].isRead) {
      anEmail.classList.remove('unread');
    }

    let senderName = anEmail.querySelector('.sender-name');
    let senderEmail = anEmail.querySelector('.sender-email');
    let messageTitle = anEmail.querySelector('.message-title');
    let message = anEmail.querySelector('.message');
    let emailTime = anEmail.querySelector('.email-time');
    let emailDate = new Date(data.items[i].date);
    let stringDate = formatDate(emailDate, 'forEmailList');
    senderName.innerHTML = data.items[i].senderName;
    senderEmail.innerHTML = data.items[i].senderEmail;
    messageTitle.innerHTML = data.items[i].messageTitle;
    message.innerHTML = data.items[i].messages[0].message;
    emailTime.innerHTML = stringDate;
    anEmail.setAttribute('data-id', data.items[i].id);
    anEmail.addEventListener('click', openEmail);
    main.appendChild(anEmail);
  }
}

function addIdToData(data) {
  for (let i = 0; i < data.items.length; i++) {
    data.items[i].id = i;
  }
  return data;
}

function formatDate(date, format) {
  let result = '';
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const acceptedFormats = ['forEmailList', 'forOpennedEmail', 'forSearResults'];
  if (acceptedFormats.includes(format)) {
    switch (format) {
      case acceptedFormats[0]:
        result = `${date.getDate()} ${monthNames[date.getMonth()].substr(0, 3)}`;
        break;
      case acceptedFormats[1]:
        result = `
        ${date.getDate()} 
        ${monthNames[date.getMonth()].substr(0, 3)} 
        ${date.getFullYear()}, 
        ${date.getHours()}:${date.getMinutes()}
        `;
        break;
      case acceptedFormats[1]:
        result = `${date.getMonth()} ${date.getDate()} ${date.getFullYear() % 100}`;
        break;
    }
  } else {
    console.log('Date format not supported');
  }
  return result;
}

function toSocial(data) {
  let social = {};
  social.items = data.items.filter((i) => {
    return i.senderName == 'Facebook' || i.senderName == 'Seytech Co';
  });
  social.next = data.next;
  social.next.page = social.items.length < 50 ? 1 : 2;
  social.total = social.items.length;
  return social;
}

//THIS SECTION IS FOR FILTERING RAW DATA
function toPromotions(data) {
  let promotions = {};
  promotions.items = data.items.filter((i) => {
    return i.senderName == 'Chase' || i.senderName == 'Seytech Co';
  });

  promotions.next = data.next;
  promotions.next.page = promotions.items.length < 50 ? 1 : 2;
  promotions.total = promotions.items.length;
  return promotions;
}

function toUpdates(data) {
  let updates = {};
  updates.items = data.items.filter((i) => {
    return i.senderName == 'Michael Dunn' || i.senderName == 'Seytech Co';
  });
  updates.next = data.next;
  updates.next.page = updates.items.length < 50 ? 1 : 2;
  updates.total = updates.items.length;
  return updates;
}

// OPEN INDIVIDUAL EMAIL
function openEmail(event, data) {
  let currElement = event.target;
  //What is the class name of the currElement?
  //If it is bucket, star, or spam then do other funcitons and return
  //else continue executing the below code
  let email;
  if (myData) {
    let openWindowEmail = document.querySelector('.opened-email');
    let curID = getIdOfEmailClicked(currElement);
    myData.items[curID].isRead = true;
    removeAllFromDom();
    hideMainCheckBox();
    openWindowEmail.style.display = 'block';
    let senderName = document.querySelector('.sender-full-name');
    senderName.innerHTML = myData.items[curID].senderName;
    let emailAddress = document.querySelector('.sender-email-open');
    emailAddress.innerHTML = myData.items[curID].senderEmail;
    let emailSubject = document.querySelector('.subject');
    emailSubject.innerHTML = myData.items[curID].messageTitle;
    let emailMessage = document.querySelector('.message-open');
    emailMessage.innerHTML = myData.items[curID].messages[0].message;
    let emailTime = document.querySelector('.time-date-openned');
    let emailDate = new Date(myData.items[curID].date);
    let stringDate = formatDate(emailDate, 'forOpennedEmail');
    emailTime.innerHTML = stringDate;
  }
}

function hideMainCheckBox() {
  let mainCheckBox = document.querySelector('#selectAll');
  mainCheckBox.style.display = 'none';
  let arrowDown = document.querySelector('.fa-caret-down');
  arrowDown.style.display = 'none';
  let returnButton = document.querySelector('.return');
  returnButton.style.display = 'block';
  returnButton.addEventListener('click', closeOpenedEmail);
}

function closeOpenedEmail() {
  let mainCheckBox = document.querySelector('#selectAll');
  mainCheckBox.style.display = 'block';
  let arrowDown = document.querySelector('.fa-caret-down');
  arrowDown.style.display = 'block';
  let returnButton = document.querySelector('.return');
  returnButton.style.display = 'none';
  let openWindowEmail = document.querySelector('.opened-email');
  openWindowEmail.style.display = 'none';
  listAllEmails(currDisplayedData);
}

function getIdOfEmailClicked(element) {
  let checkedElement = element
  console.log(checkedElement)
  while (!checkedElement.hasAttribute('data-id')) {
    checkedElement = checkedElement.parentElement;
  }
  return checkedElement.getAttribute('data-id');
}

// Tool
document.getElementById('selectAll').addEventListener(
  'click',
  function (ev) {
    ev.target.parentNode.parentNode.classList[ev.target.checked ? 'add' : 'remove']('selected');
  },
  false
);

//EVENT LISTENER FOR SEARCH BAR -- OUR LOCAL SEARCH ENGINE
let drop = document.querySelector('.middle div')
let searchMiddle = document.querySelector('.middle')
searchBar.addEventListener('input', getSearchCriteria)

function getSearchCriteria(e) {
  if (e.target.value == '') {
    dropdownForSearch.innerHTML = ''
  }
  drop.style.display = 'block'
  searchedResult.items = [];
  for (let i = 0; i < myData.items.length; i++){
    for (let k in myData.items[i]){
      if (typeof myData.items[i][k] == 'string' && k !== 'date'){
        if(e.target.value === '') {
          searchedResult.items.length = 0;
          searchedResult.total = searchedResult.items.length
          return
        } 
        if (myData.items[i][k].toLowerCase().includes(e.target.value.trim().toLowerCase())) {
          searchedResult.items.push(myData.items[i])
        }
        
      }
      else {
        if (Array.isArray(myData.items[i][k])) {
          for (let j = 0; j < myData.items[i][k].length; j++) {
            // console.log('this', myData.items[i][k])
            //       console.log('this',myData.items[i][k])
            if(myData.items[i][k][0].message.toLowerCase().includes(e.target.value.trim().toLowerCase())){
              searchedResult.items.push(myData.items[i])
            }
          }
          
        }
      }
      
    }
  }
  searchedResult.next = searchedResult.next
  searchedResult.total = searchedResult.items.length
  console.log(e.target.value, searchedResult)
  if (!drop.classList.contains('search-drop-result')){
    drop.classList.toggle('search-drop-result')
  }
  
  renderToDropMenu()
}

function renderToDropMenu () {
  dropdownForSearch.innerHTML = ''
  
  for (let i = 0; i < searchedResult.total; i++) {
    let date = new Date(searchedResult.items[i].date)
    let div = document.createElement('div')
    div.className = 'searched-email'
    div.innerHTML = `
    <div class="left-side">
    <i class="fas fa-envelope"></i>
    <div class="searched-message">
    <div class="searched-top">
    ${searchedResult.items[i].messageTitle}
    </div>
    <div class="searched-bottom">
    ${searchedResult.items[i].senderName}
    </div>
    </div>
    </div>
    <div class="right-side">
    ${date.getMonth()}/${date.getDate()}/${date.getFullYear()%100}
    </div>
    `
    div.setAttribute('data-id', searchedResult.items[i].id)
    console.log(div.getAttribute('data-id'), 'id-match', searchedResult.items[i].id)
    div.addEventListener('click', openEmail)
    dropdownForSearch.appendChild(div)
  }
}


document.getElementById('selectAll').addEventListener('click', function(ev) {
  ev.target.parentNode.parentNode.classList[ev.target.checked ? 'add' : 'remove']('selected');
}, false);


//SIDEBAR SWITCHING
let btnSwitch = document.querySelectorAll('.left-tag')
for (let i = 0; i < btnSwitch.length; i++) {
  btnSwitch[i].addEventListener('click', changeToAnother)
}
function changeToAnother(e) {
  for (let i = 0; i < btnSwitch.length; i++){
    btnSwitch[i].classList.remove('switch')
  }
  let el = e.currentTarget;
  el.classList.add('switch')
  console.log(e.currentTarget)
}


//SIDEBAR CATEGORIES DROPDOWN
let categoriesButton = document.querySelector('.dropbtn')
categoriesButton.addEventListener('click',myFunction)

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
  console.log('hello')
}

// // Close the dropdown if the user clicks outside of it
// window.onclick = function(event) {
//   if (!event.target.matches('.dropbtn')) {
//     var dropdowns = document.getElementsByClassName("dropdown-content");
//     var i;
//     for (i = 0; i < dropdowns.length; i++) {
//       var openDropdown = dropdowns[i];
//       if (openDropdown.classList.contains('show')) {
//         openDropdown.classList.remove('show');
//       }
//     }
//   }
// }

searchBar.addEventListener('change', closeSearchMenu)


function closeSearchMenu() {
  console.log('check check check')
  setTimeout(()=>{
    drop.style.display = 'none'
  }, 140)
}

//COMPOSE MESSAGE OPEN/CLOSE
let composeButton = document.querySelector('.compose');
let openButton = document.querySelector('.window');
let closeButton = document.querySelector('.close-icon');

composeButton.addEventListener('click',()=>{
  openButton.classList.add("compose-window");
})

closeButton.addEventListener('click',(e)=>{
  openButton.classList.remove('compose-window'); 
})




