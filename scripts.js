const DATA_URL = "https://www.hatchways.io/api/assessment/students";

let studentsStore = [];
let studentsDisplay = [];

function getData () {
    axios.get(DATA_URL)
    .then(res => {
        studentsStore = [...res.data.students];
        studentsDisplay = [...res.data.students];
    })
    .catch(err => {
        console.log("Could not fetch data!");
        console.log(err);
    });
}

function processData () {
    document.getElementById("card-container").innerHTML = "";

    studentsDisplay.forEach((el, studentIndex) => {
        const theImageNode = document.createElement("img");
        theImageNode.setAttribute("src", el.pic);

        const theNameNode = document.createElement("h1");
        theNameNode.appendChild(document.createTextNode(el.firstName + " " + el.lastName));
        const collapsableButton = document.createElement("button");
        collapsableButton.setAttribute("data-toggle", "collapse");
        collapsableButton.setAttribute("data-target", `#grade-list-${studentIndex}`);
        collapsableButton.setAttribute("class", "btn btn-info");

        collapsableButton.innerText = "Show Tests";

        const theHeadingContainer = document.createElement("div");
        theHeadingContainer.appendChild(theNameNode);
        theHeadingContainer.appendChild(collapsableButton)
        theHeadingContainer.setAttribute("class", "heading-container");

        const theEmailNode = document.createElement("p");
        theEmailNode.appendChild(document.createTextNode("Email: " + el.email));
        const theCompanyNode = document.createElement("p");
        theCompanyNode.appendChild(document.createTextNode("Company: " + el.company));
        const theSkillNode = document.createElement("p");
        theSkillNode.appendChild(document.createTextNode("Skill: " + el.skill));

        let total = 0.0;
        let average = 0.0;

        const theGradeListNode = document.createElement("div");
        theGradeListNode.appendChild(document.createTextNode("Test Marks:"));
        theGradeListNode.appendChild(document.createElement("br"));
        theGradeListNode.appendChild(document.createElement("br"));

        const theGradeList = document.createElement("ul");
        theGradeListNode.setAttribute("id", `grade-list-${studentIndex}`)
        theGradeListNode.setAttribute("class", "grade-list collapse");


        el.grades.forEach((grade, index)=> {
            total = total + parseInt(grade);
            const gradeItem = document.createElement("li");
            gradeItem.appendChild(document.createTextNode("Test " + (index+1) + " : " + grade + "   %"));
            theGradeList.appendChild(gradeItem);
        });
        theGradeListNode.appendChild(theGradeList);
        average = total/el.grades.length;

        const theAverageNode = document.createElement("p");
        theAverageNode.appendChild(document.createTextNode("Average: " + average + "%"));

        

        const tagInputBox = document.createElement("input");
        tagInputBox.setAttribute("type", "text");
        tagInputBox.setAttribute("placeholder", "Add a tag");
        tagInputBox.setAttribute("class", "input-boxes tag-input-box");
        tagInputBox.setAttribute("studentId", `${studentIndex}`);

        const tagInputForm = document.createElement("form");
        tagInputForm.setAttribute("class", "tag-input-form");
        tagInputForm.appendChild(tagInputBox);

        theGradeListNode.appendChild(tagInputForm);

        const theInfoNode = document.createElement("div");
        theInfoNode.setAttribute("class", "card-info");

    
        theInfoNode.appendChild(theHeadingContainer);
        theInfoNode.appendChild(theEmailNode);
        theInfoNode.appendChild(theCompanyNode);
        theInfoNode.appendChild(theSkillNode);
        theInfoNode.appendChild(theAverageNode);

        if("tags" in studentsDisplay[studentIndex]){
            const theTagListNode = document.createElement("div");
            theTagListNode.appendChild(document.createTextNode("Tags:"));
            theTagListNode.appendChild(document.createElement("br"));
            theTagListNode.appendChild(document.createElement("br"));


            const theTagList = document.createElement("ul");
            theTagList.setAttribute("class", `tag-lists`);
            studentsDisplay[studentIndex]["tags"].forEach(tag => {
                const tempTag = document.createElement("li");
                tempTag.appendChild(document.createTextNode(tag));
                tempTag.setAttribute("role", "alert");
                tempTag.setAttribute("class", "alert alert-primary");
                theTagList.appendChild(tempTag);
            });
            theTagListNode.appendChild(theTagList);
            theInfoNode.appendChild(theTagListNode);
        }

        theInfoNode.appendChild(theGradeListNode);


        const theCardNode = document.createElement("div");
        theCardNode.setAttribute("class", "card");

        theCardNode.appendChild(theImageNode);
        theCardNode.appendChild(theInfoNode);

        const horizontalRule = document.createElement("hr");

        document.getElementById("card-container").appendChild(theCardNode);
        document.getElementById("card-container").appendChild(horizontalRule);

        document.getElementById("name-input-box").disabled = false;
        document.getElementById("tag-input-box").disabled = false;

    });

    addTags();
}

function nameInputChange (event) {
    const newList = [];
    studentsStore.forEach(el => {
        if((el.firstName.includes(event.target.value)) || (el.lastName.includes(event.target.value))){
            newList.push(el);
        }
    })
    studentsDisplay = newList;
    processData();
}

function newTag (event) {
    event.preventDefault();
    const studentId = parseInt(event.target.children[0].getAttribute("studentid"));
    if(!("tags" in studentsDisplay[studentId])){
        studentsDisplay[studentId].tags = [];
    }
    studentsDisplay[studentId].tags.push(event.target.children[0].value)
    processData();
}

function addTags () {
    const tagInputForms = document.getElementsByClassName("tag-input-form");

    for (tagInputForm of tagInputForms) {
        tagInputForm.addEventListener("submit", newTag);
    }
}

document.getElementById("name-input-box").addEventListener("input", nameInputChange);



getData();

setTimeout(() => {
    processData(); 
}, 500);





// setTimeout(() => {
//     console.log("Data Fetching Wait Complete ..."); 
//     processData();
//     }, 2500);

