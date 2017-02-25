function uploader(request, response){
	if (request.getMethod() == 'GET'){
		var form = nlapiCreateForm('Upload File');
		 var fileField = form.addField('file', 'file', 'Select File');
		 fileField.setMandatory(true)   
		 form.addSubmitButton();
		 form.addResetButton();
		 response.writePage(form);
   }
   else{
        var file = request.getFile("file")
        file.setFolder(259023); //internalid of Folder
        var id = nlapiSubmitFile(file);
   }
 
//var form = nlapiCreateForm('Upload File');
//var text1=form.addField('success', 'label', 'Upload Succesful!');
//response.writePage(form);
}