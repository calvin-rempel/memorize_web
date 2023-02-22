var chapterContent = []; //The text of the chapter
var maxVerses = 0; //The number of verses in the chapter
var selectedVerse = 0; //The index number of the verse selected.

var abbreviatedVerse = ""; //The string that the masked verse goes into.
var maskLength = 0; //How much of the abbreviated verse is masked.
var verseIsHidden = false; //Whether or not the verse is hidden.

var helpText = ""; //Used to store the help text.
var translation = "kjv"; //Set default translation to KJV

/**
 * Function: hideVerse()
 * Purpose: To hide the verse from view on screen and update the indicators and
 *           tracking variable.
 * Preconditions: the verse variable and tracking variable must be instantiated.
 * Postconditions: The tracking variable will be updated.
 * Side Effects: indicator on screen will be set and the verse text cleared.
 */
function hideVerse(){
    verseIsHidden = true;
    document.getElementById("full_text_box").innerText = "";
    document.getElementById("hidden_unhidden_indicator").innerText = "[HIDDEN]";
}

/**
 * Function: showVerse()
 * Purpose: Shows the verse on screen and updates the indicators and tracking
 *          Variables
 * Preconditions: Verse variables and tracking variables must be instantiated.
 * Postconditions: Tracking variable will be updated.
 * Side effects: Text on screen will be populated/updated.
 */
//=== Begin function showVerse() ==============================================
function showVerse(){
    verseIsHidden = false;
    document.getElementById("full_text_box").innerText = verseText;
    document.getElementById("hidden_unhidden_indicator").innerText = "[UNHIDDEN]";
}
//--- End function showVerse() ------------------------------------------------

/**
 * Function: toggleHideVerse()
 * Purpose: To toggle back and fourth between hiding and unhiding a verse.
 * Preconditions: Verse content an hide/unhide variable must be instantiated.
 * Postconditions: Verse will be hidden if it was unhidden and vis-versa.
 * Side Effects: Updates/clears some text on screen.
 */
//=== Begin function toggleHideVerse() ========================================
function toggleHideVerse(){
    if(verseIsHidden){
        showVerse();
    } else {
       hideVerse();
    }
}
//--- End function toggleHideVerse() ------------------------------------------

/**
 * Function: printAbbrev()
 * Purpose: To print out the abbreviated text, incorporating the mask to hide or unhide
 *          the abbreviated text.
 * Preconditions: Verse text and mask length must be instantiated.
 * Postconditions: Verse text and mask indicator will be updated on screen.
 * Side Effects: None.
 */
//=== Begin function printAbbrev() ============================================
function printAbbrev(){
    outputString = "";
    for(var i = 0; i < abbreviatedVerse.length; ++i){
        if(i < maskLength){
            outputString = outputString + "*";
        } else {
            outputString = outputString + abbreviatedVerse[i];
        }
    }

    document.getElementById("abbreviated_text_box").innerText = outputString;
    document.getElementById("mask_indicator").innerText = "Mask: " + String(maskLength);
}
//--- End function printAbbrev() --------------------------------------------------------

/**
 * Function: incrementMask()
 * Purpose: To increase the size of the mask covering the abbreviated verse text.
 * Preconditions: Mask length variable and verse text must be instantiated.
 * Postconditions: If possible, the mask length will be increased.
 * Side Effects: The abbreviated text may be re-drawn if any change in mask length
 *               occurred.
 */
//=== Begin function incrementMask() ==========================================
function incrementMask(){
    if((maskLength + 1) <= abbreviatedVerse.length){
        ++maskLength;
        printAbbrev();
    }
}
//--- End function incrementMask() --------------------------------------------

/**
 * Function: decrementMask()
 * Purpose: To decrease the size of the mask covering the abbreviated verse text.
 * Preconditions: Mask length variable and verse text must be instantiated.
 * Postconditions: If possible, the mask length will be decreased.
 * Side Effects: The abbreviated text may be re-drawn if any change in mask length
 *               occurred.
 */
//=== Begin function decrementMask() ==========================================
function decrementMask(){
    if((maskLength - 1) >= 0){
        --maskLength;
        printAbbrev();
    }
}
//--- End function decrementMask() --------------------------------------------

/**
 * Function: loadChapterList()
 * Purpose: To Load the list of chapters for the selected book of the Bible
 * Preconditions: book_select must be instantiated.
 * Postconditions: If successful, the chapter_select list will be instantiated.
 * Side Effects: Triggers loadChapter()
 */
//=== Begin Function loadChapterList() ========================================
function loadChapterList(){
    //Determine which book of the Bible is selected
    bookID = document.getElementById("book_select").value;
    
    //Prep to make an AJAX request to get the chapter list
    const httpReq = new XMLHttpRequest();
    httpReq.onload = function() {
        //When the requested list arrives, inject it into the document in the
        //"chapter_select" drop-down menu.
        document.getElementById("chapter_select").innerHTML = this.responseText;
        //When the "chapter_select" drop-down menu is instantiated, fetch the first
        //chapter.
        loadChapter();
    }

    //Make the get request
    httpReq.open("GET", translation + "/" + bookID + ".txt", true);
    httpReq.send();
}
//--- End Function loadChapterList() ------------------------------------------

/**
 * Function: loadChapter()
 * Purpose: To load the selected chapter of the Bible into memory.
 * Preconditions: chapter_select must be instantiated.
 * Postconditions: the variables chapterContent, selectedVerse and maxVerses will be instantiated.
 * Side Effects: Loads the first verse of the chapter into the HTML document.
 */
//=== Begin function loadChapter() ============================================
function loadChapter(){
    //Determine which chapter has been selected
    chapterID = document.getElementById("chapter_select").value;
    
    //Prep to make the request
    const httpReq = new XMLHttpRequest();
    httpReq.onload = function() {
        //When the requested chapter loads, split it up by line and shove it into
        //the chapterContent array.
        chapterContent = this.responseText.split('\n');

        //Determine how many verses are in this chapter, and set the selectedVerse to
        //the first one, starting count at 0.
        maxVerses = chapterContent.length;
        
        //If the last line in the chapter file is a blank line, do not treat it as a verse.
        if(chapterContent[maxVerses - 1] == ""){
            --maxVerses;
        }
        
        selectedVerse = 0;

        //Load the verse into the HTML document
        loadVerse();
    }

    httpReq.open("GET", translation + "/" + chapterID + ".txt", true);
    httpReq.send();
}
//--- End of function loadChapter() -------------------------------------------

/**
 * Function: loadVerse()
 * Purpose: To pull a verse out of the chapterContent array, load it into memory,
 *          parse it to generate the abbreviated verse, reset verse hiding/masking
 *          variables and then insert the verse text and abbreviated text into the
 *          HTML document.
 * Preconditions: chapterContent must have been loaded and related variables
 *                instantiated.
 * Postconditions: variables instatiated and text inserted into HTML document.
 * Side Effects: None.
 */
//=== Begin function loadVerse() ==============================================
function loadVerse(){
    //Reset variables
    maskLength = 0;

    //Load the verse into memory
    verseText = chapterContent[selectedVerse];

    //Generate the abbreviated verse text
    abbreviatedVerse = "";
    isNewWord = true;
    for(var i = 0; i < verseText.length; ++i){
        //If it is the start of a new word and the characters is a letter
        if((verseText[i] >= 'a' && verseText[i] <= 'z') || (verseText[i] >= 'A' && verseText[i] <= 'Z')){
            if(isNewWord){
                abbreviatedVerse = abbreviatedVerse + verseText[i];
                isNewWord = false;
            }
        } else {
            //If we have punctuation...
            if(verseText[i] != ' '){
                abbreviatedVerse = abbreviatedVerse + verseText[i];
            }
            //Since spaces and punctuation indicate that a new word will be starting...
            isNewWord = true;
        }
    }

    //Set verse text and abbreviated verse text.
    showVerse();
    printAbbrev();
    document.getElementById("verse_number").innerText = "Verse: " + String(selectedVerse + 1);
}
//--- End function loadVerse() ------------------------------------------------

/**
 * Function: incrementVerse()
 * Purpose: To select the next verse in the chapter.
 * Preconditions: Verse and Chapter data must be instantiated.
 * Postconditions: If there is another verse to move to in the chapter, it will be
 *                 selected.
 * Side Effects: loadVerse() will be run.
 */
//=== Begin function incrementVerse() =========================================
function incrementVerse(){
    
    if((selectedVerse + 1) < maxVerses){
        selectedVerse = selectedVerse + 1;
        loadVerse();
    }
}
//--- End function incrementVerse() -------------------------------------------

/**
 * Function: decrementVerse()
 * Purpose: To select the previous verse in the chapter.
 * Preconditions: Verse and Chapter data must be instantiated.
 * Postconditions: If there an earlier verse to move to in the chapter, it will be
 *                 selected.
 * Side Effects: loadVerse() will be run.
 */
//=== Begin function decrementVerse() =========================================
function decrementVerse(){
    
    if((selectedVerse - 1) >= 0){
        selectedVerse = selectedVerse - 1;
        loadVerse();
    }
}
//--- End function decrementVerse() -------------------------------------------

/**
 * Function: showHelp()
 * Purpose: To output the help text into the full verse text area.
 * Preconditions: Help text needs to have been instantiated and should have been
 *                Populated with the help text.
 * Postconditions: None.
 * Side Effects: Verse will be temporarily replaced with the help text.
 */
//=== Begin function showHelp() ===============================================
function showHelp(){
    document.getElementById("full_text_box").innerHTML = helpText;
}
//--- End function showHelp() -------------------------------------------------

/**
 * Function: help()
 * Purpose: To load and then trigger the showing of the help text.
 * Preconditions: helpText variable needs to have been instantiated.
 * Postconditions: helpText variable will have the help text loaded.
 * Side Effects: Help text will be shown in the full verse text area.
 */
//=== Begin function help() ===================================================
function help(){
    //If the help text has not already been loaded, load it.
    if(helpText == ""){
        //Prep to make an AJAX request to get the help text.
        const httpReq = new XMLHttpRequest();
        httpReq.onload = function() {
            //When the requested help file arrives, store it in memory so we don't need
            //to reload it.
            helpText = this.responseText;
            
            //Show the loaded help text.
            showHelp();
        }

        httpReq.open("GET", "help.txt", true);
        httpReq.send();
    } else {
        //If the help text was already loaded into memory, show it.
        showHelp();
    }
}
//--- End function help() -----------------------------------------------------

/**
 * Function: setTranslation()
 * Purpose: Set which translation directory we are using. Allows user to select between
 *          Bible translations.
 * Preconditions: Translation variable must be instantiated.
 * Postconditions: Translation variable value will match that of the dropdown menu.
 * Side Effects: Will run loadChapter() and update variables and text on screen.
 */
//=== Begin function setTranslation() =========================================
function setTranslation(){
    translation = document.getElementById("translation_select").value;
    loadChapter();
}
//--- End function setTranslation() -------------------------------------------
