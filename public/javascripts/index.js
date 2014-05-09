(function(){

// 插入 <ul> 之 <li> 樣板
var tmpl = '<li><input type="text"><span></span></li>',
    addButton = $('#add'),
    connected = $('.connected'),      // 三個 <ul>
    placeholder = $('#placeholder'),  // 三個 <ul> 的容器
    mainUl = $('.main'),              // main <ul>
    deleteUl = $('.delete'),          // delete <ul>
    doneUl = $('.done');              // done <ul>
var itemid;
 var flag = false;
 var start, end;



    

    $(addButton).click(function(){

        $(tmpl).prependTo(mainUl).addClass("is-editing").find('input').focus();
    }); 
        mainUl.on('keyup','input',function(e){
          if(e.which !== 13){
            flag=true;
          }
          if(flag===true){
              if(e.which === 13){
              var input = $(this);
              li = input.parents('li');
              li.find('span').text( input.val() );
              li.removeClass('is-editing');
              
              console.log("cool!");

              var newitem = {"done": false, "text": input.val()} ;

              $.ajax({
                url: '/items',
                type: 'post',
                data: JSON.stringify(newitem),
                dataType: 'json',
                contentType: 'application/json',
                success: function(data){
                  console.log("POSt!");
                }
              });
              } 
          }
        
        });

      
    

    load();
/*
    function save(){
    	
    	var arr = [];
    	mainUl.find("span").each(function(){
    		arr.push({"done":($(this).parent('li').hasClass("is-done"))?true:false,"text":$(this).text()});
    	})

    	localStorage.todoItems = JSON.stringify(arr); 

    }
*/
    function load()
    {	
      $.ajax({
        url: '/items',
        type: 'get',
        dataType: 'json',
        success: function(data){
            console.log( JSON.stringify(data) );

            var i;

            for(i=0; i<data.length; i +=1){
              if(data[i].done == true){
              $(tmpl).appendTo(mainUl).find('span').text(data[i].text).parent('li').addClass('is-done')
              }
              else{
              $(tmpl).appendTo(mainUl).find('span').text(data[i].text)
              }
              
            }
        }
      });

      
  	}



  	$('.main, .done, .delete').sortable({
  		
      connectWith: '.connected', 
  		tolerance: "pointer",
  		start: function(e,ui){
  			$(placeholder).addClass("is-dragging");
        
        itemid = ui.item.index();
        start = ui.item.index();
        console.log("start: ",start);  
        
        console.log(itemid);
  		},
  		stop: function(e,ui){
        $(placeholder).removeClass("is-dragging");
        end = ui.item.index();
        console.log("end: ",end);  

        if(end>=0){
          
          $.ajax({
            type: 'PUT',
            url: '/items/'+start+'/reposition/'+end,
            dataType:"json",
            contentType: 'application/json',
            success: function(data) {
              console.log('move success');
              
            }
          });
        
        }

  		}


  	});

  	$(".delete").on( "sortreceive", function(e, ui){
      $(placeholder).removeClass("is-dragging");
        $.ajax({
          url: '/items/'+itemid,
          type: 'delete',
          dataType:'json',
          success:function(data){
            console.log( JSON.stringify(data) );
          }
        })
  		ui.item.remove();
  	});
  	$(".done").on( "sortreceive", function(e, ui){
      $.ajax({
          url: '/items/'+itemid,
          type: 'put',
          dataType:'json',
          success:function(data){
            console.log( JSON.stringify(data) );
          }
        })
  		$(ui.item).appendTo(mainUl).addClass("is-done");
  	});
}());