let header = document.getElementById("header");
let body = document.getElementById("body");

for(let i=65; i<=90; i++){
    let char = String.fromCharCode(i);

    const bold = document.createElement("b");
    bold.innerText = char;

    header.appendChild(bold);
}


let sheets = [];

let activeSheetIndex = 0;

function addRow(num){
    const row= document.createElement("div");
    row.className = "row";
    for(let i=64; i<=90; i++){
        if(i===64){
            let b = document.createElement("div");
            b.id = "num";
            b.innerText = num;
            row.appendChild(b);
        }
        else{
            const cell = document.createElement("div");
            cell.id =`${String.fromCharCode(i)}${num}`;
            cell.contentEditable = "true";
            cell.addEventListener("focus", onCellFocus);
            row.appendChild(cell);
        }
    }
    body.appendChild(row);
}


for(let i=1; i<=100; i++){
    addRow(i);
}



function saveTheSheet(){
    console.log(document.getElementById("num"));
    const data = {
        rows: [],
      };
    
      // Loop through rows and cells to collect data
      const rows = document.querySelectorAll(".row");
  
      rows.forEach((row) => {
        const rowData = [];
        const cells = row.querySelectorAll("#num, div[contentEditable='true']");
        cells.forEach((cell) => {
          const cellData = {
            id: cell.id,
            text: cell.innerText,
            style: {
              fontFamily: cell.style.fontFamily,
              fontWeight: cell.style.fontWeight,
              fontStyle: cell.style.fontStyle,
              textDecoration: cell.style.textDecoration,
              textAlign: cell.style.textAlign,
              color: cell.style.color,
              backgroundColor: cell.style.backgroundColor,
              fontSize: cell.style.fontSize,
            },
          };
          rowData.push(cellData);
        });
        data.rows.push(rowData);
      });
    
      // Convert data to JSON string
      const jsonData = JSON.stringify(data);
    //   console.log(jsonData);
      sheets[activeSheetIndex] = jsonData;
}



function addNewSheet(){
    // save the currently used sheet
        saveTheSheet();

      body.innerHTML="";



    //   create new sheet with new body
    for(let i=1; i<=100; i++){
        addRow(i);
    }

    const newSheet = document.createElement("div");
    newSheet.className = "sheet activeSheet"; 
    newSheet.setAttribute("data-value",sheetsContainer.children.length) ;  // 0, 1, 2, 3
    newSheet.innerText  = `sheet ${sheetsContainer.children.length + 1}`;    // 1 , 2, 3
    
    newSheet.addEventListener("click", () => sheetSelect(newSheet));
    newSheet.addEventListener("contextmenu", function (e) {
        e.preventDefault(); // Prevent the default context menu
        deleteSelectedSheet(this); // Call your custom function
    });

    const activeSheet = sheetsContainer.querySelector(".activeSheet");
    if (activeSheet) {
      activeSheet.classList.remove("activeSheet");
    }

    // Append the new sheet to the sheetsContainer
    sheetsContainer.appendChild(newSheet);

    // console.log(sheetsContainer.children.length);
    
    // also save the new sheet in the sheets
    


    activeSheetIndex = sheetsContainer.children.length - 1;  // 0 based indexing
 
}

const sheetsContainer = document.getElementById("sheetsContainer");

const sheetAddBtn = document.getElementById("sheetAddBtn");

sheetAddBtn.addEventListener("click", addNewSheet);











function sheetSelect(sheet){
    saveTheSheet();


    let sheetNum = sheet.getAttribute("data-value");
    const activeSheet = sheets[sheetNum];
    activeSheetIndex = sheetNum;
    const jsonData = JSON.parse(activeSheet);
    // console.log(jsonData);
    // Identify the target sheet where the data should be added
    const body = document.getElementById("body");
    body.innerHTML = ""; // Clear existing rows
    jsonData.rows.forEach((rowData) => {
        const row = document.createElement("div");
        row.className = "row";


        rowData.forEach((cellData) => {
            // console.log(cellData.id);
            if(cellData.id === "num"){
                // console.log("num");
                let b = document.createElement("div");
                b.id = "num";
                b.innerText = cellData.text;
                row.appendChild(b);
            }
            else{
                // console.log("yay")
                const cell = document.createElement("div");
                cell.id = cellData.id;
                cell.contentEditable = "true";
                cell.innerText = cellData.text;
                // Apply styles from cellData.style to cell
                Object.assign(cell.style, cellData.style);
                cell.addEventListener("focus", onCellFocus);
                row.appendChild(cell);
            }
        
        });

        // giving the active css
        const activeSheet = sheetsContainer.querySelector(".activeSheet");
        if (activeSheet) {
            activeSheet.classList.remove("activeSheet");
        }
        sheet.classList.add('activeSheet');
        
    body.appendChild(row);});  

    
}





function deleteSelectedSheet(sheet){
    // alert("Your sheet will be removed permanently, Are you sure ?");

    
    let sheetNum = parseInt(sheet.getAttribute("data-value"), 10);

    handleSheetRemovalUi(sheet);
    // Remove the sheet from the 'sheets' array
    if (sheetNum >= 0 && sheetNum < sheets.length) {
        sheets.splice(sheetNum, 1);
    }

    

    sheetNum = 0;

    const activeSheet = sheets[sheetNum];
    activeSheetIndex = sheetNum;
    const jsonData = JSON.parse(activeSheet);
    // console.log(jsonData);
    // Identify the target sheet where the data should be added
    const body = document.getElementById("body");
    body.innerHTML = ""; // Clear existing rows
    jsonData.rows.forEach((rowData) => {
        const row = document.createElement("div");
        row.className = "row";


        rowData.forEach((cellData) => {
            // console.log(cellData.id);
            if(cellData.id === "num"){
                // console.log("num");
                let b = document.createElement("div");
                b.id = "num";
                b.innerText = cellData.text;
                row.appendChild(b);
            }
            else{
                // console.log("yay")
                const cell = document.createElement("div");
                cell.id = cellData.id;
                cell.contentEditable = "true";
                cell.innerText = cellData.text;
                // Apply styles from cellData.style to cell
                Object.assign(cell.style, cellData.style);
                cell.addEventListener("focus", onCellFocus);
                row.appendChild(cell);
            }
        
        });


        
        
    body.appendChild(row);});  
    

}


function handleSheetRemovalUi(sheet){
    let allSheets = document.querySelectorAll(".sheet");
    if(allSheets.length === 1) {
        alert("you can not remove one last sheet");
        return;
    }

    else{
        const ans = confirm("Do you really want to delete this sheet permanently?");
        if(ans===false){
            return;
        }
        sheet.remove();


        for(let i=0; i<allSheets.length; i++){
            allSheets[i].setAttribute("data-value" , i);
            allSheets[i].innerText = `sheet ${i+1}`;
        }

        const activeSheet = sheetsContainer.querySelector(".activeSheet");
        if (activeSheet) {
            activeSheet.classList.remove("activeSheet");
        }

        allSheets[0].classList.add('activeSheet');
    }
}

