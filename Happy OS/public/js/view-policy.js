function showDrop() {
  var x = document.getElementById("wel-drop");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

// function getSelectedProgram() {
//   let json=[];
//   var program = document.getElementById("programs").value;
//   var category = document.getElementById("categories").value;
//   body_json_string = '{"program":' + JSON.stringify(json) + '}'
  
//   if (program == undefined || program == '') {
//     alert('Please Select Program');
//     return
//   }
//   //debugger
//  // window.location.replace(`/viewPolicy/${program}`);
//  // return;
 


//   let formData = new FormData();
//   formData.append("program", program)
//   formData.append("catagory", category)
//   formData.append("get", body_json_string)

//   // let requestOptions = {
//   //   method : 'POST',
//   //   body : formData
//   // }

//   // fetch(`/viewPolicy}`, requestOptions).then((response) => {
//   //   var data= response.text();
//   // }).then((result) => {
//   //  // window.location.href = `/program/${program}`
//   // }).catch((err) => {
//   //   console.log('errro : ' + err)
//   // })

// }

