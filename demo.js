$(document).ready(function () {

    var url = "ajax/ajaxCard";
    var ajaxobj = new AjaxObject(url, 'json');
    ajaxobj.getall();
    
  //所有dialog初始鎖定input
  $('.modal').on('shown.bs.modal', function () {
      $("input:text:visible:first").focus();
  })


  //表單開啟後初始狀態(新增)
  $('#AddTable').on('shown.bs.modal', function() {
      //新增按鈕
  $("#RunAdd").click(function (e){
      e.preventDefault();
      var url = "ajax/ajaxCard";
      var cnname = $("#addcnname").val();
      var enname = $("#addenname").val();
      var sex = $('input:radio:checked[name="addsex"]').val();
      var ajaxobj = new AjaxObject(url, 'json');
      ajaxobj.cnname = cnname;
      ajaxobj.enname = enname;
      ajaxobj.sex = sex;
      ajaxobj.add();       

     });

        //重置按鈕
  $("#RunAddReset").click(function (e){  
      e.preventDefault();
      $("#addform")[0].reset();
      $('#addcnname').focus();
  });


});

  //表單開啟後初始狀態(搜尋)
  $('#SearchTable').on('shown.bs.modal', function() {
        //搜尋按鈕
       $("#RunSearch").click(function (e){
          e.preventDefault();
          var url = "ajax/ajaxCard";
          //var data = $("#searchform").serialize();
          var cnname = $("#secnname").val();
          var enname = $("#seenname").val();
          var sex = $('input:radio:checked[name="sesex"]').val();
          var ajaxobj = new AjaxObject(url, 'json');
          ajaxobj.cnname = cnname;
          ajaxobj.enname = enname;
          ajaxobj.sex = sex;
          ajaxobj.search();
       });

      //重置按鈕
      $("#RunSearchReset").click(function (e){ 
          e.preventDefault(); 
          $("#searchform")[0].reset();
          $('#secnname').focus();
       });


  });

  //表單開啟後初始狀態(修改)
  $('#ModifyTable').on('shown.bs.modal', function() {
    var modifyid = $(this).attr('id').substring(12);
          $.ajax({
              url: "ajax/ajaxCard_modify_get.txt",//"welcome/ajaxCard",//
              type: "POST",
              data: ({'operate':'modified','id': modifyid}),
              dataType: 'json',
              success: function (response) {
                  $("#mocnname").val(response[0].cnname);
                  $("#moenname").val(response[0].enname);
                  if (response[0].sex == 0) {
                      $("#modifyman").prop("checked", true);
                      $("#modifywoman").prop("checked", false);
                  }
                  else {
                      $("#modifyman").prop("checked", false);
                      $("#modifywoman").prop("checked", true);
                  }
                  $("#modifysid").val(modifyid);
                  
              }
          });


        //修改按鈕
       $("#RunModify").click(function (e){
          e.preventDefault();
          var url = "ajax/ajaxCard";
          var cnname = $("#mocnname").val();
          var enname = $("#moenname").val();
          var sex = $('input:radio:checked[name="mosex"]').val();
          var ajaxobj = new AjaxObject(url, 'json');
          ajaxobj.cnname = cnname;
          ajaxobj.enname = enname;
          ajaxobj.sex = sex;
          // ajaxobj.id = modifyid;
          ajaxobj.modify();

       });

          //重置按鈕
        $("#RunModifyReset").click(function (e){  
            e.preventDefault();
            $("#modifyform")[0].reset();
            $('#mocnname').focus();
         });

  });

      //表單開啟後初始狀態(刪除)
      $('#DeleteDialog').on('shown.bs.modal', function() {

          //刪除按鈕
           $("#RunDelete").click(function (e){
            e.preventDefault();
            var deleteid = $(this).attr('id').substring(12);
            var url = "ajax/ajaxCard";
            var ajaxobj = new AjaxObject(url, 'json');
            ajaxobj.id = deleteid;
            ajaxobj.delete();
           });

      });

});

function AjaxObject(url, datatype) {
    this.url = url;
    this.datatype = datatype;
}

AjaxObject.prototype.cnname = '';
AjaxObject.prototype.enname= '';
AjaxObject.prototype.sex = '';
AjaxObject.prototype.id = 0;

AjaxObject.prototype.getall = function () {
    $.ajax({
        type: "POST",
        url: "ajax/ajaxCard_get.txt",
        data: ({"operate":"get"}),
        dataType: "json",
        success: function (data) {
            refreshTable(data);
        },
        error: function (msg) {
            alert(msg.responseText);
        }
    });
}

AjaxObject.prototype.add = function () {
    $.ajax({
        type: "POST",
        url: this.url+"_add.txt",//'welcome/ajaxCard',//this.url,
        data: ({'operate':'add', 'cnname':this.cnname, 'enname':this.enname, 'sex':this.sex}),  // serializes the form's elements.
        dataType: this.datatype,
        success: function (response) {
            $('#AddTable').modal('hide');
            refreshTable(response);
        },
        error: function (msg) {
            alert(msg.responseText);
        }
    });
}

AjaxObject.prototype.search = function () {
    $.ajax({
        type: "POST",
        url: this.url+"_search.txt",
        data: ({'operate':'search', 'cnname':this.cnname, 'enname':this.enname, 'sex':this.sex}),  // serializes the form's elements.
        dataType: this.datatype,
        success: function (response) {
            $('#SearchTable').modal('hide');
            refreshTable(response);
        },
        error: function (msg) {
            alert(msg.responseText);
        }
    });
}

AjaxObject.prototype.modify = function () {
    $.ajax({
        type: "POST",
        url: "ajax/ajaxCard_modify_response.txt",//this.url,
        data: ({'operate':'modifiedsub', 'cnname':this.cnname, 'enname':this.enname, 'sex':this.sex, 'id':this.id}),  // serializes the form's elements.
        dataType: this.datatype,
        success: function (response) {
            $('#ModifyTable').modal('hide');
            refreshTable(response);
        },
        error: function (msg) {
            alert(msg.responseText);
        }
    });
}

AjaxObject.prototype.delete = function () {
    $.ajax({
        type: "POST",
        url: this.url+"_delete.txt",
        data: ({'operate':'deleted','id': this.id}),
        dataType: this.datatype,
        success: function (response) {
            $('#DeleteDialog').modal('hide');
            refreshTable(response);
        },
        error: function (msg) {
            alert(msg.responseText);
        }
    });
}

function refreshTable(data) {
    //var HTML = '';
    $("#cardtable tbody > tr").remove();
    $.each(data, function (key, item) {
        var strsex = '';
        if (item.sex == 0)
            strsex = '男';
        else
            strsex = '女';
        var row = $("<tr></tr>");
        row.append($("<td></td>").html(item.cnname));
        row.append($("<td></td>").html(item.enname));
        row.append($("<td></td>").html(strsex));

        row.append($("<td></td>").html(item.phone));//手機
        row.append($("<td></td>").html(item.mail));//電子信箱

        row.append($("<td></td>").html('<button type="button" id="modifybutton' + item.s_sn + '"class="btn btn-warning FontStyle" data-toggle="modal" data-target="#ModifyTable" data-backdrop="static" data-keyboard="false">修改 <span class="glyphicon glyphicon-list-alt"></span></button>'));
        row.append($("<td></td>").html('<button type="button" id="deletebutton' + item.s_sn + '"class="btn btn-danger FontStyle" data-toggle="modal" data-target="#DeleteDialog" data-backdrop="static" data-keyboard="false">刪除 <span class="glyphicon glyphicon-trash"></span></button>'));
        $("#cardtable").append(row);
        // HTML += '<tr><td>' + item.cnname + '</td><td>' + item.enname +'</td><td>' + strsex + 
        // '</td><td><button id="modifybutton'+ item.s_sn +
        // '"class="btn btn-warning" style="font-size:16px;font-weight:bold;">修改 <span class="glyphicon glyphicon-list-alt"></span></button></td><td><a id="deletebutton'
        // + item.s_sn+'"class="btn btn-danger" style="font-size:16px;font-weight:bold;">刪除 <span class="glyphicon glyphicon-trash"></span></button></td></tr>';
    });
    //$('#cardtable').append(HTML);
}
