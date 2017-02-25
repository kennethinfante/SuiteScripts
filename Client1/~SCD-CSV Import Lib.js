/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Jul 2013     pblancaflor
 *
 */

/**
 * @namespace This is the Solution Development Group namespace. Functions and fields are prefixed with "scd" to avoid code conflicts.
 */
var scd = scd || {};

scd.csvObject = function(aContent) {
  this._aContent = aContent;
};

/**
 * Returns the number of rows in the CSV.
 * 
 * @returns {Number}
 */
scd.csvObject.prototype.getRowCount = function() {
  var nRowCount = this._aContent.length;
  
  return nRowCount;
};

/**
 * Returns the number of columns in the specified row.
 * 
 * @param {Number} nRowNumber
 * @returns {Number}
 */
scd.csvObject.prototype.getColumnCount = function(nRowNumber) {
  var arrRowContent = this._aContent[nRowNumber];
  var nColumnCount = arrRowContent.length;
  
  return nColumnCount;
};

/**
 * Returns the value of the specified cell.
 * 
 * @param {Number} nRowNumber
 * @param {Number} nColumnNumber
 * @returns {String}
 */
scd.csvObject.prototype.getCellValue = function(nRowNumber, nColumnNumber) {
  var sCellValue = this._aContent[nRowNumber][nColumnNumber];
  
  return sCellValue;
};

/**
 * Sets the value of the specified cell.
 * 
 * @param {Number} nRowNumber
 * @param {Number} nColumnNumber
 * @param {String} sValue
 * @returns
 */
scd.csvObject.prototype.setCellValue = function(nRowNumber, nColumnNumber, sValue) {
  var arrRowContent = this._aContent[nRowNumber];
  
  if(typeof arrRowContent === "undefined") {
    for(var i = this._aContent.length; i <= nRowNumber; i++) {
      this._aContent[i] = new Array();
      
      if(i == nRowNumber) {
        arrRowContent = this._aContent[nRowNumber];
      }
    }
  }
  
  arrRowContent[nColumnNumber] = sValue;
};

/**
 * Returns the CSV contents as a String.
 * 
 * @returns {String}
 */
scd.csvObject.prototype.getContentAsText = function() {
  var aContent = new Array();
  
  var nRowCount = this.getRowCount();
  
  for(var i = 0; i < nRowCount; i++) {
    var nColumnCount = this.getColumnCount(i);
    
    var aRow = new Array();
    
    for(var j = 0; j < nColumnCount; j++) {
      
      var sCellValue = this.getCellValue(i, j);
      
      aRow.push(sCellValue);
    }
    
    var sRow = aRow.join(",");
    
    aContent.push(sRow);
  }
  
  var sContent = aContent.join("\n") + "";
  
  return sContent;
};

/**
 * Returns the CSV contents as an Array.
 * 
 * @returns {Array}
 */
scd.csvObject.prototype.getContentAsArray = function() {
  return this._aContent;
};

/**
 * Returns the CSV contents as an nlobjFile object.
 * 
 * @param {String} sCsvFilename
 */
scd.csvObject.prototype.getContentAsFile = function(sCsvFilename) {
  var sCsvFullFilename = sCsvFilename + ".csv";
  var sCsvTextContent = this.getContentAsText();
  
  var fileCSV = nlapiCreateFile(sCsvFullFilename, "CSV", sCsvTextContent);
  
  return fileCSV;
};

scd.csvUtils = {
  /**
   * Generates a new instance from an nlobjRequest.
   * 
   * @param {nlobjRequest} oRequest
   * @param {Boolean} bUseBase64
   * @param {String} sParameterId
   */
  generateFromRequest : function(oRequest, bUseBase64, sParameterId) {
    var oCsvObject = null;
    
    var fileCsv = request.getFile(sParameterId);
    
    if(fileCsv != null) {
      var aCsvData = this._processCsvFile(fileCsv, bUseBase64);
      
      oCsvObject = new scd.csvObject(aCsvData);
    }
    
    return oCsvObject;
  },
  
  /**
   * Generates a new instance from an nlobjFile.
   * 
   * @param {Boolean} bUseBase64
   * @param {nlobjFile} fileData
   */
  generateFromFile : function(fileData, bUseBase64) {
    var oCsvObject = null;
    
    if(fileData != null) {
      var aCsvData = this._processCsvFile(fileData, bUseBase64);
      
      oCsvObject = new scd.csvObject(aCsvData);
    }
    
    return oCsvObject;
  },
  
  /**
   * Generates a new instance from an Array.
   * 
   * @param {Array} aCsvData
   */
  generateFromArray : function(aCsvData) {
    var oCsvObject = null;
    
    if(aCsvData != null) {
      oCsvObject = new scd.csvObject(aCsvData);
    }
    
    return oCsvObject;
  },
  
  /**
   * Sets the response so that when loaded, the CSV file will be returned.
   * 
   * @param {nlobjRequest} oResponse
   * @param {csvObject} oCsvObject
   * @param {String} sCsvFilename
   */
  setResponseAsCSV : function(oResponse, oCsvObject, sCsvFilename) {
    var sCsvFullFilename = sCsvFilename + ".csv";
    
    oResponse.setContentType("CSV", sCsvFullFilename, "attachment");
    
    var nRowCount = oCsvObject.getRowCount();
    
    for(var i = 0; i < nRowCount; i++) {
      var arrColumns = new Array();
      var nColumnCount = oCsvObject.getColumnCount(i);
      
      for(var j = 0; j < nColumnCount; j++) {
        var sCellValue = oCsvObject.getCellValue(i, j);
        
        arrColumns.push(sCellValue);
      }
      
      var sColumns = arrColumns.join(",");
      
      response.writeLine(sColumns);
    }
  },
    
  /**
   * Processes the CSV file converting it into the CSV Object.
   * 
   * @param {nlobjFile} fileCsv
   * @param {Boolean} bUseBase64
   * @returns {Array}
   */
  _processCsvFile : function(fileCsv, bUseBase64) {
    fileCsv.setEncoding("UTF-8");
    
    var sCsvContent, sFileValue = fileCsv.getValue();
    
    if(bUseBase64) {
      sCsvContent = scd.base64Utils.decode(sFileValue);
    }
    else {
      sCsvContent = sFileValue;
    }
    
    var aCsvContent = this._csvToArray(sCsvContent);
    
    return aCsvContent;
  },
  
  _csvToArray : function(sCsvContent) {
    var aCsvData = new Array();
    
    var arrRows = sCsvContent.split("\n");
    
    for(var i = 0; i < arrRows.length; i++) {
      var sRow = arrRows[i];
      
      var aColumns = new Array();
      
      if(!this._isStringEmpty(sRow)) {
        aColumns = this._splitRowToColumns(sRow, ",");
      }
      
      aCsvData.push(aColumns);
    }
    
    return aCsvData;
  },
  
  _isStringEmpty : function (sString) {
    if(sString == null) {
      return true;
    }
    else if(sString == "") {
      return true;
    }
    else if(sString == "null") {
      return true;
    }
    else {
      return false;
    }
  },
  
  _splitRowToColumns : function (sRowData) {
    var sDelimiter = ",";
    
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(  (  "(\\" + sDelimiter + "|\\r?\\n|\\r|^)" +   // Delimiters.
                                     "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +        // Quoted fields.
                                     "([^\"\\" + sDelimiter + "\\r\\n]*))"      // Standard fields.
                                  ),
                                  "gi"
                               );
    
    var aData = new Array();
    
    var aMatches = null;
    
    // Note: This is a hack that adds an extra "," before each row because the RegEx seems to
    //       ignore the ",<data>" pattern (a.k.a. the first column).
    var sHackedStrRowData = "," + sRowData;
    
    // Keep looping over the RegEx matches.
    while (aMatches = objPattern.exec(sHackedStrRowData)) {
      var sMatchedValue;
      
      if (aMatches[2]) {
        // Quoted fields. Unescape any double quotes.
        sMatchedValue = aMatches[2].replace(  new RegExp( "\"\"", "g" ),
                                              "\""
                                           );
      }
      else {
        // Standard fields.
        sMatchedValue = aMatches[3];
      }
      
      aData.push(sMatchedValue);
    }
    
    // Return the parsed data.
    return(aData);
  }
};

/**
*  Base64 encode / decode
*  http://www.webtoolkit.info/
**/
 
scd.base64Utils = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        
        input = this._utf8_encode(input);
        
        while (i < input.length) {
          
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            
        }
        
        return output;
    },
    
    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        
        while (i < input.length) {
          
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            
            output = output + String.fromCharCode(chr1);
            
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
            
        }
        
        output = this._utf8_decode(output);
        
        return output;
        
    },
    
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        
        for (var n = 0; n < string.length; n++) {
          
            var c = string.charCodeAt(n);
            
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        
        return utftext;
    },
    
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        
        while ( i < utftext.length ) {
          
            c = utftext.charCodeAt(i);
            
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
            
        }
        
        return string;
    }
};