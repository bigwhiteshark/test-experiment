"use strict"; /* Used traditional syntax and ES5, except "let". */

/** convertJSON2Table ********************************************************
 * Constructing a class "convertJSON2Table" with private and public functions.
 * This class is ment to generate a html-table from a given JSON-Object.
 *
 * KNOWN BUG:
 * There is a known issue with this script.
 * All properties in the JSON must have a unique name,
 * or the properties with the same name,
 * must be in exactly the same nested order.
 *
 * If there are two or more properties with the same name,
 * and different nested order
 * the script fails to place them to the right position.
 *
 */

/* BUG-Details:
// This fails, due to the different nested depth of properties with same name
{
    "myProp1": {
        ,"samePropertyName": {
            "prop1": 1
        }
        ,"notWorking": {
            "samePropertyName": {
                "prop1": 1
            }
        }
    }
}
// This still works, due to the same nested depth
{
    "myProp1": {
        ,"workingOne": {
            ,"samePropertyName": {
                "prop1": 1
            }
        }
        ,"workingTwo": {
            "samePropertyName": {
                "prop1": 1
            }
        }
    }
}
*/

let convertJSON2Table = function () {
  /**
   * PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE
   * PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE PRIVATE
   */

  // Common settings needed inside this class
  let internalSettings = {
    myURLTogetJSON: "./mvc/model/example-content.json",
    rowNumber: 1,
    columnNumber: 1,
    columnsAmount: 1,
    tableRowContent: "",
    completeTableContentSorted: [],
    myBIGJSONPrototype: "",
  };

  // Retrieve DOM-elements needed inside this class
  let DOM = {
    root: document.body,
    tableContainer: "",
  };

  /**
   * 3
   * Generate a htm-table from
   * the prepared JSON-content (internalSettings.completeTableContentSorted)
   **/
  let createTable = function () {
    let myTable = document.createElement("table");

    let tableContent = internalSettings.completeTableContentSorted;
    let tableContentLength = tableContent.length; // amount rows

    // Could look like following
    //"1|1|divisionOne"
    //"2|2|divisionDescriptionOne|a list of some movies ..."
    //"3|2|movies"
    //"4|3|cinema"
    //"5|4|titles"
    //"6|5|oblivion|tom cruise,and a girl"
    //"7|5|blade runner|harrison ford,and a girl"
    //"8|5|ghost in the shell|the girl"
    //"9|5|metropolis|the girl"

    let rememberValueForSameLineNextCol = "unset";

    for (let row = 1; row <= tableContentLength; row++) {
      let myTableRow = document.createElement("tr");
      myTable.appendChild(myTableRow); // attach a row for every entry in array "tableContent"

      let theWantedRow = parseInt(tableContent[row - 1].split("|")[0]);
      let theWantedColumn = parseInt(tableContent[row - 1].split("|")[1]);
      let theWantedPropertyName = tableContent[row - 1].split("|")[2];
      let rowContentLength = tableContent[row - 1].split("|").length;

      for (let column = 1; column <= internalSettings.columnsAmount; column++) {
        let myTableColumn = document.createElement("td");

        if (theWantedRow == row && theWantedColumn == column) {
          myTableColumn.innerText = theWantedPropertyName;
        }

        // a. In case the property has a value
        // which must be written in the same line but next column ...
        if (rowContentLength > 3) {
          // b. ... we remember the value ...
          rememberValueForSameLineNextCol = tableContent[row - 1].split("|")[3];

          if (
            theWantedRow == row &&
            theWantedColumn + 1 == column &&
            rememberValueForSameLineNextCol != "unset"
          ) {
            // c. ... and write it in the next td-round when we are in the next column...
            myTableColumn.innerText = rememberValueForSameLineNextCol;
            rememberValueForSameLineNextCol = "unset"; // ... finally we set the flag, back to "unset".
          }
        }

        myTableRow.appendChild(myTableColumn);
      }
    }

    DOM.tableContainer.appendChild(myTable);
  };

  // Source code found here:
  // https://stackoverflow.com/questions/39941691/how-to-get-the-json-path-from-element
  // Adaptation:
  // I would have preferred to comment that answer on stackoverflow, but I had not enough reputation.
  // In my case there was a small issue with my JSON-content.
  // Some values were the boolean "false",
  // and some values were the number 0 (not as string),
  // and that always led to a script error.
  // I was able to avoid the error by adapting the "if"-query,
  // by converting the first o[k] to a string.
  // Like this: "if (k === key && o[k].toString() && o[k].type === value) {"
  let getPath = function (object, search) {
    function iter(o, p) {
      return Object.keys(o).some(function (k) {
        if (k === key && o[k].toString() && o[k].type === value) {
          path = p.concat(k).join(".");
          return true;
        }
        if (o[k] !== null && typeof o[k] === "object") {
          return iter(
            o[k],
            k === "properties" && !o.title
              ? p
              : p.concat(k === "properties" && o.title ? o.title : k)
          );
        }
      });
    }

    let parts = search.split(":"),
      key = parts[0],
      value = parts[1],
      path;

    iter(object, []);

    // IMPORTANT NOTE @Dev:
    // the "path" would be the path to the object-property
    // separated by a dot e.g. // myProp1.myProp11.myProp111
    // return path;
    let myColumn = path.split(".").length;
    return myColumn;
  };

  // Source code found here:
  // https://stackoverflow.com/questions/13523951/how-to-check-the-depth-of-an-object
  let findOutHowManyColumnsTheTableNeeds = function (object) {
    let level = 1;

    for (let key in object) {
      if (!object.hasOwnProperty(key)) continue;

      if (typeof object[key] == "object") {
        let depth = findOutHowManyColumnsTheTableNeeds(object[key]) + 1;
        level = Math.max(depth, level);
      }
    }
    return level;
  };

  /**
   * 2
   * Get the right table row, column and value of the properties.
   **/
  function walkThrough(myBIGJSON) {
    let propNames = Object.getOwnPropertyNames(myBIGJSON);
    let props = Object.keys(myBIGJSON);

    for (let i = 0; i < propNames.length; i++) {
      let prop = myBIGJSON[propNames[i]];
      let flagArrBool = Array.isArray(prop);

      if (typeof prop == "object" && prop !== null && flagArrBool != true) {
        // Here we have the situation, that we have a property which has a deeper Object in it as value
        internalSettings.tableRowContent =
          internalSettings.rowNumber +
          "|" +
          getPath(internalSettings.myBIGJSONPrototype, props[i]) +
          "|" +
          props[i];
        internalSettings.completeTableContentSorted.push(
          internalSettings.tableRowContent
        );

        internalSettings.rowNumber++;

        walkThrough(prop); // RECURSIVE !
      } else {
        // Here we have the situation, that the property has a value which needs to be placed in the same line
        if (
          typeof props[i] != "undefined" &&
          props[i] != null &&
          props[i] != 0
        ) {
          internalSettings.columnNumber = getPath(
            internalSettings.myBIGJSONPrototype,
            props[i]
          );
          internalSettings.tableRowContent =
            internalSettings.rowNumber +
            "|" +
            getPath(internalSettings.myBIGJSONPrototype, props[i]) +
            "|" +
            props[i];

          // Increase column-counter for the value of the property in the same line
          internalSettings.columnNumber =
            parseInt(internalSettings.columnNumber) + 1;

          internalSettings.tableRowContent =
            internalSettings.tableRowContent + "|" + prop;
          internalSettings.completeTableContentSorted.push(
            internalSettings.tableRowContent
          );

          internalSettings.rowNumber++;
        }
      }
    }
  }

  /**
   * 1
   * We need to find out how many columns the table will need,
   * then we walkThrough the JSON to get all the wanted content,
   * means the property-names, their values
   * and find out where they have to be positioned in the table.
   *
   * Then we prepare a list (completeTableContentSorted) where
   * we remember the collected informations.
   *
   * An entry could look like: "10|5|title|ghost in the shell"
   * To be read like: row 10, column 5, property-name "title" and value "ghost in the shell"
   **/
  let getTablePositions = function (myBIGJSON) {
    internalSettings.columnsAmount =
      findOutHowManyColumnsTheTableNeeds(myBIGJSON);

    walkThrough(myBIGJSON);

    createTable(); // htm-table
  };

  /**
   * PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC
   * PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC PUBLIC
   */

  /**
   * 0 entrypoint
   **/
  this.init = function (myBIGJSON, DOMTargetContainer) {
    // We want to remeber the original JSON-object, we could need it later on.
    internalSettings.myBIGJSONPrototype = myBIGJSON;
    DOM.tableContainer = DOMTargetContainer;
    getTablePositions(myBIGJSON);
  };
};

/********************************************************************************
 * INSTANTIATE (with "new") the Variable "JSON2Table"                           *
 * with the class "convertJSON2Table" to make the class available to be invoked *
 ********************************************************************************/
let JSON2Table = new convertJSON2Table();
