const db = require('../../generics/db/db');
var fs = require('fs');
var path = require('path');
const open = require('open');

exports.addPolicies = async (req, page_res, next) => {
    let policy_Id;
    let statue_Id;
    const statues = JSON.parse(req.body.get);
    const Policy_No = req.body.statue_number;
    const Progress_Note = req.body.statue_name;
    const Program = req.body.program;
    const Category = req.body.catagory;
    const FilePath = next.replace(/\\/g, '/');

    await db('policy').insert({ Policy_No, Progress_Note, Program, Category, FilePath }).returning('Policy_Id').then((insert_res) => {
        policy_Id = insert_res[0].Policy_Id;
    })
    .catch((err) => {
        return page_res.render('admin', {
            error_msg: 'Something went wrong while inserting Policy Data'
        })
    })

    const statueArray = statues['statues'] //call statues from body_json_string     
    for (let i = 0; i < statueArray.length; i++) {
        const Statue_Name = statueArray[i]['name'];
        await db('Statues').insert({ Statue_Name, policy_id: policy_Id }).returning('Id').then((statue_res) => {
            statue_Id = statue_res[0].Id;
        }).catch((error) => {
            return page_res.render('admin', {
                error_msg: 'Something went wrong while inserting Statues Data'
            })
        })

        let divisions = statueArray[i]['divisions'];
        for (let j = 0; j < divisions.length; j++) {
            const division_name = divisions[j].name
            await db('SubDivisions').insert({ SubDivision_Name: division_name, Statue_Id: statue_Id }).then((division_res) => {
            }).catch((err) => {
                return page_res.render('admin', {
                    error_msg: 'Something went wrong while inserting Divisions Data'
                })
            })
        }
    }
    page_res.render('admin');
}


// exports.ViewStatues = async (req, res)=> {
// const program = JSON.parse(req.body.get);
// const programArray = program['program'];
// const Program_Name = programArray[0]['program'];
// const Category_Name = programArray[1]['category'];
// const program1 = req.body.program;
//     console.log(program);
// req.session.program = program1;

// res.redirect('/viewPolicy');
// return;
// res.send('<script>alert("File Uploading Failed");window.location.href =/viewPolicy </script>'); 
// return page_res.send('<script>window.location.replace="/viewPolicy"</script>')
// return page_res.redirect('/viewPolicy');
// return;

// }


exports.viewPolicy = async (req, page_res, next) => {
    if (req.session.already_logged === 'false' || req.session.already_logged === undefined) {
        page_res.render('login')
    }
    else {
        return page_res.render('viewPolicy', {
            name: req.session.name
        })
    }
}

exports.getProgramPolicy = async (req, page_res, next) => {
    if (req.session.already_logged === 'false' || req.session.already_logged === undefined) {
        page_res.render('login')
    }
    else {
        const Program = req.body.program;
        const Category = req.body.category;
        req.session.program = Program;
        req.session.category = Category;
        await db.select().from('policy').where({ Program }).andWhere({ Category }).then((res) => {
            page_res.render('viewPolicy', {
                name: req.session.name,
                policy: res
            })
        }).catch((err) => {
            page_res.render('viewPolicy', {
            error: 'Something went wrong while getting policies'
            })
        })
    }
}

exports.ViewStatues = async (req, res) => {
    const Id = req.params.Id;
    let json = [];
    if (Id.includes("download")) {
        this.Download_File(req, res, Id);
    }
    else {
        var decodedId = Buffer.from(Id, 'base64').toString('utf-8');
        var policy_id = decodedId.replace("policy_", "");
        await db.select().from('Statues').where({ policy_id }).then(async (statue_res) => {
            for (let i = 0; i < statue_res.length; i++) {
                var Statue_Id = 'statue_' + statue_res[i].Id;
                let Obj = { policy_id, statues: [{ Id: Statue_Id, name: statue_res[i].Statue_Name, divisions: [] }] }
                var Statue_Id = statue_res[i].Id;
                await db.select().from('SubDivisions').where('Statue_Id', '=', Statue_Id).then(async (division_res) => {
                    for (let x = 0; x < division_res.length; x++) {
                        Obj.statues[0].divisions.push({
                            division: division_res[x].SubDivision_Name
                        })
                    }
                    json.push(Obj);
                }).catch((err) => {
                    res.send('Something went wrong while getting SubDivisions');
                })
            }
        }).catch((err) => {
             res.send('Something went wrong while getting Statues');
        })
        await db.select().from('policy').where({ Program: req.session.program }).andWhere({ Category: req.session.category }).then((policy_res) => {
            return res.render('viewPolicy', { data: json, name: req.session.name, policy: policy_res });
        })
            .catch(err => {
                return res.render('viewPolicy', {
                    error: 'Something went wrong while getting policies'
                })
            });
    }
}

exports.Download_File = async (req, res, Id) => {
    if(Id.name!='next' && Id.includes("download_")){
     var policy = Id.replace("download_", "");
    }
    else{
      var decodedId = req.params.Id;
       policy = Buffer.from(decodedId, 'base64').toString('utf-8').replace("policy_", "");
    }
   
    await db.select('FilePath').from('policy').where({ Policy_Id: policy }).then((file_res) => {
        res.download(file_res[0].FilePath, (err) => {
            if (err) {
                console.log(err);
            }
        })
        console.log("File Downloaded Successfully!");
    }).catch((err) => {
        res.send('Something went wrong while selecting File Path');
    })
}


exports.View_File = async (req, res, Id) => {  
    var decodedId = req.params.Id;
    policy = Buffer.from(decodedId, 'base64').toString('utf-8').replace("policy_", "");
    await db.select('FilePath').from('policy').where({ Policy_Id: policy }).then((file_res) => {
        var FilePath = path.join(__dirname, `../../${file_res[0].FilePath}`);
        open(FilePath);
        console.log('File Opened Successfully!');
        return res.redirect('back'); 
    }).catch((err) => {
        res.send('Something went wrong while opening file');
    }) 
}

