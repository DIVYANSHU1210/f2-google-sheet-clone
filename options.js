const activeCellEliment = document.getElementById("active-cell");
const boldButton = document.getElementById("bold");
const italicButton = document.getElementById("italic");
const underlinedButton = document.getElementById("underlined");
const textAlignElements = document.getElementsByClassName("text-align");

let selectedFont = document.getElementById("fontSelect");
let selectedSize = document.getElementById("font-size");
let activeCell = null;



 

function onCellFocus(e){
    if(activeCell && activeCell.id === e.target.id){
        return ;
    }

    activeCellEliment.innerText = e.target.id;
    activeCell = e.target;
    const computedStyle = getComputedStyle(activeCell);
    activeOptionState = {
        fontFamily: computedStyle.fontFamily,
        isBoldSelected : computedStyle.fontWeight === "600",
        isItalicSelected: computedStyle.fontStyle === "italic",
        isUnderLineSelected: computedStyle.textDecoration.includes("underline"),
        textAlign: computedStyle.textAlign,
        textColor: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor,
        fontSize: computedStyle.fontSize
    }

    highlightOptionButtonsOnFocus();
}


function toggleButtonStyle(button, isSelcted){
    if(isSelcted){
        button.classList.add("active-option"); 
    }
    else{
        button.classList.remove("active-option");
    }
}

function highlightOptionButtonsOnFocus(){
    toggleButtonStyle(boldButton, activeOptionState.isBoldSelected);

    toggleButtonStyle(italicButton, activeOptionState.isItalicSelected);

    toggleButtonStyle(underlinedButton, activeOptionState.isUnderLineSelected);

    highlightTextAlignButtons(activeOptionState.textAlign);
}





function onClickBold(boldButton){
    boldButton.classList.toggle("active-option");
    if(activeCell){
        if(activeOptionState.isBoldSelected == false){
            activeCell.style.fontWeight = "600";
        }
        else {
            activeCell.style.fontWeight = "400";
        }

        activeOptionState.isBoldSelected = !activeOptionState.isBoldSelected;
    }
}

function onClickItalic(italicButton){
    italicButton.classList.toggle("active-option");
    if(activeCell){
        if(activeOptionState.isItalicSelected == false){
            activeCell.style.fontStyle = "italic";
        }
        else {
            activeCell.style.fontStyle = "normal";
        }

        activeOptionState.isItalicSelected= !activeOptionState.isItalicSelected;
    }
}

function onClickUnderline(underlineButton){
    underlineButton.classList.toggle("active-option");
    if(activeCell){
        if(activeOptionState.isUnderLineSelected == false){
            activeCell.style.textDecoration = "underline";
        }
        else {
            activeCell.style.textDecoration = "none";
        }

        activeOptionState.isUnderLineSelected= !activeOptionState.isUnderLineSelected;
    }
}

function highlightTextAlignButtons(selectedValue){
    for(let i=0; i<textAlignElements.length; i++){
        if(textAlignElements[i].getAttribute("data-value") === selectedValue){
            textAlignElements[i].classList.add("active-option");
        }
        else{
            textAlignElements[i].classList.remove("active-option");
        }
    }
}

function onClickTextAlign(textAlignButton){
    let selectedValue = textAlignButton.getAttribute("data-value");
    highlightTextAlignButtons(selectedValue);
    
    if(activeCell){
        activeOptionState.textAlign = selectedValue;
        activeCell.style.textAlign = selectedValue;
    }
}



function onChangeTextColor(textColorInput){
    let selectedColor = textColorInput.value;
    if(activeCell){
        activeCell.style.color = selectedColor;
        activeOptionState.textColor = selectedColor;
    }
}


function onChangeBackgroundColor(bgColorInput){
    let selectedColor = bgColorInput.value;
    if(activeCell){
        activeCell.style.backgroundColor= selectedColor;
        activeOptionState.backgroundColor = selectedColor;
    }
}








selectedFont.addEventListener("change",()=>{
    if(activeCell){
        let myFont = selectedFont.value;
        activeCell.style.fontFamily = myFont;
        activeOptionState.fontFamily = myFont;
    }
})



selectedSize.addEventListener("change",()=>{
    if(activeCell){
        let newSize = selectedSize.value;
        activeCell.style.fontSize = newSize;
        activeOptionState.fontSize = newSize; 
    }
})





function downloadAsJSON() {
    // Create a JSON object to store data
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
  
    // Create a Blob with JSON data
    const blob = new Blob([jsonData], { type: "application/json" });
  
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
  
    // Create an anchor element for downloading
    const a = document.createElement("a");
    a.href = url;
    a.download = "grid_data.json";
  
    // Trigger a click event on the anchor element to initiate the download
    a.click();
  
    // Clean up the URL
    URL.revokeObjectURL(url);
  }


    

  
// Add event listeners to the download and upload buttons.
document.getElementById('download-button').addEventListener('click', downloadAsJSON);



// Add an event listener to the "Upload" button
const uploadButton = document.getElementById("upload-button");

uploadButton.addEventListener("click", function () {
  // Create an input element (type="file") dynamically
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";

  // Add an event listener to handle the file selection
  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const jsonStr = e.target.result;
        try {
          const jsonData = JSON.parse(jsonStr);
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
                    // console.log("yippy")
                    let b = document.createElement("b");
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
        catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };

      reader.readAsText(file);
    }
  });

  // Trigger the file input dialog by programmatically clicking it
  fileInput.click();
});



