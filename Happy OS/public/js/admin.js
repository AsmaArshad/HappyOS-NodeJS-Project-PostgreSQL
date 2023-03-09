let policy_id = 0;
let focus_id = 1;
let statue_id = 0;
let json = [];
let input = '';
var focusedDivisionId = 1;
var focusedDivisionIndex;
var DivisionChangeValue;
let subdivisions = {};
var SingleStatue = '';
let DivisionName='';

function savePolicyData() {
  let files = document.getElementById('files');
  let policy_number = document.getElementById('policy').value
  let policy_name = document.getElementById('progress_note').value
  let program = document.getElementById('program').value
  let category = document.getElementById('category').value
  //json-object

  //JSON.stringify() converts an array or object into json
  body_json_string = '{ "statues":' + JSON.stringify(json) + '}'


  //IF MISSING USER INPUT ON FORM SUBMISSION
  if (files.files == undefined || files.files.length < 1) {

    alert('Choose file')
    return
  }
  else if (policy_number == '' || policy_number == undefined) {

    alert('Provide Policy Number')
    return
  }
  else if (policy_name == '' || policy_name == undefined) {

    alert('Provide Policy Number')
    return
  }


  debugger

  let formData = new FormData();
  formData.append("statue_number", policy_number)
  formData.append("statue_name", policy_name)
  formData.append("program", program)
  formData.append("catagory", category)
  formData.set("files", files.files[0])
  formData.append("get", body_json_string)

  //connection Backend
  let requestOptions = {
    method : 'POST',
    body : formData
  }

  console.log(formData);

  fetch("addPolicies", requestOptions).then((response) => {
    response.text();
  }).then((result) => {
    window.location.href = '/admin';
    alert('Policy Data Added Successfully!');
    return;
  }).catch((err) => {
    console.log('errro : ' + err)
  })
}



const add_policy = () => {
  policy_id = json.length + 1;
  var singleElement = '{"id":"' + policy_id + '", "name": "", "divisions":[]}';
  json.push(JSON.parse(singleElement)); //convert json string to object
  addStatuses(policy_id);
}

const addStatuses = (policy_id) => {
  let statueInput = document.createElement('input');
  statueInput.type = 'text';
  statueInput.id = policy_id;
  statueInput.setAttribute('class', 'ny-inp')
  statueInput.placeholder = 'Add Statue';

  const parentDiv = document.getElementById('custom-div'); //Statue Div
  parentDiv.appendChild(statueInput);  //Append Input Field into Parent Statue Div

  var statueInputId = document.getElementById(statueInput.id); //Access Statue Input Field with Id
  statueInputId.addEventListener("click", () => {
    //on Statue Input Field click

    focus_id = statueInput.id;  // Assign StatueId to focus_id variable                 
    var RemoveDiv = document.getElementById('d-remove');
    RemoveDiv.remove();     //Remove Div with id d-remove inside subdivision


    //Create a div with id d-remove and append this inside subdivision div
    var DivElm = document.createElement('div');
    DivElm.id = 'd-remove';
    let parentSubDivision = document.getElementById('custom-division');
    parentSubDivision.appendChild(DivElm);
    console.log(json);
    showDivision();
  })

  statueInputId.addEventListener("focusout", () => { //On FocusOut of Statue Input Field 
    debugger
    var statue_value = document.getElementById(focus_id).value;   //get statue value with Id
   json[focus_id - 1]['name'].value = statue_value;  
   console.log(statue_value);
   console.log("json:"+ json[focus_id - 1]['name'].value);

    for (let i = 0; i < json.length; i++) {
      //assign statue value in json (name: ) where focus_id matches with json id 
      if (json[i].id === focus_id) {
        json[i].name = statue_value;
        return;
      }
    }
  })
}

function showDivision() {
  for (y = 0; y < json.length; y++) {
    SingleStatue = json[y];
    subdivisions[SingleStatue.id] = SingleStatue;  //assign one Statue to subdivisions object
    var StatueName = json[y]['name'];
    document.getElementById(y + 1).innerText = StatueName;  //assign Statue Value from json to Statue TextField
  }
    for (let z = 0; z < subdivisions[focus_id].divisions.length; z++) { //loop until divisions length
      var divisionName = subdivisions[focus_id].divisions[z].name;  
      //get divisionName from subdivisions object
      //Create SubDivisionInputField, assign division value & append it in RemoveDiv
      var SubDivInput = document.createElement('input');
      SubDivInput.type = 'text';
      SubDivInput.setAttribute('class', 'ny-inp')
      SubDivInput.id = 'division_' + z;
      SubDivInput.placeholder = 'Add SubDivision';
      SubDivInput.setAttribute("value", divisionName);

      var parentDiv = document.getElementById('d-remove');
      parentDiv.appendChild(SubDivInput);

      var clickedDivison = document.getElementById(SubDivInput.id);
      clickedDivison.addEventListener('click', function() {
        focusedDivisionId = SubDivInput.id;
        focusedDivisionIndex = focusedDivisionId.split('_')[1] - 1;
      })

      clickedDivison.addEventListener('focusout', function() {
        DivisionName = document.getElementById(SubDivInput.id).value;
        changeDivisionValue(focus_id, focusedDivisionIndex, DivisionName);
      });
    }
}


function addDivision(policy_id) {
  //first time divisionId= json[0].divisions.length = 1 + 1 = 2
  var divisionId = json[focus_id - 1].divisions.length + 1;
  var singleDivision = '{"name" : ""}';
  json[policy_id - 1].divisions.push(JSON.parse(singleDivision));
  // convert json string to object and push in json(i.e. divisions: {name: ''})

  //create SubDivision input Field and append it inside removeDiv which is inside customDivision(subDivision)
  var SubDivisionInput = document.createElement('input');
  SubDivisionInput.type = 'text';
  SubDivisionInput.id = 'division_' + divisionId;
  SubDivisionInput.setAttribute('class', 'ny-inp');
  SubDivisionInput.placeholder = 'Add New Division';

  var remove_Div = document.getElementById('d-remove');
  remove_Div.appendChild(SubDivisionInput);

  var GetInputElem = document.getElementById(SubDivisionInput.id); //access SubDivision Input field
  //on subDivision input click, 
  //assign subDivision Id to FocusedDivision Id 
  //focusedDivisionIndex: split (SubDivision Input Id based on _ )
  // -1 used here bcz from id-1 we get index
  GetInputElem.addEventListener('click', function () {
    focusedDivisionId = SubDivisionInput.id;
    focusedDivisionIndex = focusedDivisionId.split('_')[1] - 1;
  })

  GetInputElem.addEventListener('focusout', function () {
    SubDivisionValue = document.getElementById(SubDivisionInput.id).value;
    changeDivisionValue(focus_id, focusedDivisionIndex, SubDivisionValue);
  })
}


function changeDivisionValue(focus_id, focusedDivisionIndex, DivisionValue) {
  for (let j = 0; j < json.length; j++) {
    //check if json id matches with focusid then add DivisionInput value in json
    if (json[j].id === focus_id) {
      json[j].divisions[focusedDivisionIndex].name = DivisionValue;
      return;
    }
  }
}

// function getSelectedProgram() {
//   debugger
//   let json=[];
//   var program = document.getElementById("programs").value;
//   var category = document.getElementById("categories").value;
  
//   if (program == undefined || program == '') {
//     alert('Please Select Program');
//     return
//   }

// json.push({"program": program})
// json.push({"category": category});
// console.log(json);
//  let body_json_string = '{ "program":' + JSON.stringify(json) + '}'


//   let formData = new FormData();
  
//   formData.append("program", program)
//   formData.append("get", body_json_string)
//   let requestOptions = {
//     method : 'POST',
//     body : formData
//   }

//   fetch('/viewPolicy', requestOptions).then((response) => {
//     var data= response.text();
//     //window.location.replace = '/viewPolicy'
//   }).then((result) => {
//    //window.location.replace = '/viewPolicy'
//   }).catch((err) => {
//     console.log('errro : ' + err)
//   })

// }