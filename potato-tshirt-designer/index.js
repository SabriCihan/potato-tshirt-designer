var frontDesignPrice;
var backDesignPrice;
var isString = function (obj) {
    return Object.prototype.toString.call(obj) == '[object String]';
  }
var ine= function (text) {
  if (text === null || text === undefined || text === "undefined" || text === "") {
    return true;
  }
  return false;
}
var  isTrue = function (value) {
    if (!ine(value)) {
      var isString = isString(value);
      if (isString) {
        if (value.toLowerCase() === "true")
          return true;
      }
      else if (value === true) {
        return true;
      }
    }
    return false;
  }
var isnull =  function (object) {
   if (object === null || object === undefined || object === "undefined") {
     return true;
   }
   return false;
 }
var inew= function (text) {
   if (text === null || text === undefined || text === "undefined" || text === "" || text === " ") {
     return true;
   }
   return false;
 }
var getFileNameFromPath= function (path) {
    var arr = path.split("\\");
    var fileName = arr[arr.length - 1];
    return fileName;
  }
var isJsonString = function (str) {
  try {
    JSON.parse(str);
  } catch (e) {
    //console.log(e)
    return false;
  }
  return true;
}

var canvas;
var GetRandomNum = function (min, max) {
  return Math.random() * (max - min) + min;
}
var OnObjectSelected = function (e) {
  var selectedObject = e.target;
  $("#CustomText").val("");
  selectedObject.hasRotatingPoint = true
  if (selectedObject && selectedObject.type === "text") {
    //display text editor
    $(".txEditor").css("display", "block");
    $("#CustomText").val(selectedObject.getText());
    $("#TextFontColor").minicolors("value", selectedObject.fill);
    $("#TextStrokecolor").minicolors("value", selectedObject.strokeStyle);
    $(".imgEditor").css("display", "block");
  }
  else if (selectedObject && selectedObject.type === "image") {
    //display image editor
    $(".txEditor").css("display", "none");
    $(".imgEditor").css("display", "block");
  }
}
var OnSelectedCleared = function (e) {
  $(".txEditor").css("display", "none");
  $("#CustomText").val("");
  $(".imgEditor").css("display", "none");
}
var SetFont = function (font) {
  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "text") {
    activeObject.fontFamily = font;
    canvas.renderAll();
  }
}
var RemoveWhite = function () {
  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "image") {
    activeObject.filters[2] = new fabric.Image.filters.RemoveWhite({ hreshold: 100, distance: 10 });//0-255, 0-255
    activeObject.applyFilters(canvas.renderAll.bind(canvas));
  }
}
var ShowBack = function () {
  RefreshDesign();
  $("#Flip").attr("data-original-title", "Turn to front");
  var backImage = $("#ProductTypeList :selected").data("back");
  $("#TshirtFacing").attr("src", "img/ProductType/" + backImage);
  $("#TshirtFacing").data("currentface", "0");
  canvas.clear();

  if (isJsonString($("#DesignBack").val())) {
    canvas.loadFromJSON($("#DesignBack").val());
  }

}
var ShowFront = function () {
  RefreshDesign();
  $("#Flip").attr("data-original-title", "Turn to Back");
  var frontImage = $("#ProductTypeList :selected").data("front");
  $("#TshirtFacing").attr("src", "img/ProductType/" + frontImage);
  $("#TshirtFacing").data("currentface", "1");
  canvas.clear();

  if (isJsonString($("#DesignFront").val())) {
    canvas.loadFromJSON($("#DesignFront").val());
  }
}
var DeleteActiveObject = function () {
  var activeObject = canvas.getActiveObject(), activeGroup = canvas.getActiveGroup();
  if (activeObject) {
    canvas.remove(activeObject);
    $("#CustomText").val("");
  }
  else if (activeGroup) {
    var objectsInGroup = activeGroup.getObjects();
    canvas.discardActiveGroup();
    objectsInGroup.forEach(function (object) {
      canvas.remove(object);
    });
  }
};
var GetTshirtSide = function () {
  return $("#TshirtFacing").data("currentface");

}
var RefreshDesign = function () {
  var side = GetTshirtSide();
  if (side == 1) {
    $("#DesignFront").val(JSON.stringify(canvas));
    var dataUrlFront = canvas.toDataURL('image/png');
    $("#DataUrlFront").val(dataUrlFront);
  }
  else if (side == 0) {
    $("#DesignBack").val(JSON.stringify(canvas));
    var dataUrlBack = canvas.toDataURL('image/png');
    $("#DataUrlBack").val(dataUrlBack);
  }
}
var RefreshPrice = function () {
  var materialPrice = parseFloat($("#ProductTypeList :selected").data("materialprice"));
  $("#MaterialPrice").text(materialPrice + " $")
  var addingTextPrice = $("#ProductTypeList :selected").data("addingtextprice");
  var addingTextPriceDouble = parseFloat(addingTextPrice);
  var addingImagePrice = $("#ProductTypeList :selected").data("addingimageprice");
  var addingImagePriceDouble = parseFloat(addingImagePrice);
  var face = GetTshirtSide();

  var front = $("#DesignFront").val();
  if (isJsonString(front)) {
    var parsed = JSON.parse(front);
    var objs = parsed.objects;
    //var objs = canvas.getObjects();
    var textCount = 0;
    var imageCount = 0;
    for (i = 0; i < objs.length; i++) {
      if (objs[i].type == "text") {
        textCount++;
      }
      else if (objs[i].type == "image") {
        imageCount++;
      }
    }
    frontDesignPrice = (textCount * addingTextPriceDouble) + (imageCount * addingImagePriceDouble);
  }
  else {
    frontDesignPrice = 0;
  }
  $("#FrontDesignPrice").text(frontDesignPrice + " $")


  var back = $("#DesignBack").val();
  if (isJsonString(back)) {
    var parsed = JSON.parse(back);
    var objs = parsed.objects;
    //var objs = canvas.getObjects();
    var textCount = 0;
    var imageCount = 0;
    for (i = 0; i < objs.length; i++) {
      if (objs[i].type == "text") {
        textCount++;
      }
      else if (objs[i].type == "image") {
        imageCount++;
      }
    }
    backDesignPrice = (textCount * addingTextPriceDouble) + (imageCount * addingImagePriceDouble);

  } else {
    backDesignPrice = 0;
  }
  $("#BackDesignPrice").text(backDesignPrice + "$")

  var total = materialPrice + (frontDesignPrice || 0) + (backDesignPrice || 0);
  $("#TotalPrice").text(total + " $")
}

canvas = new fabric.Canvas("tcanvas", {
  hoverCursor: "pointer",
  selection: true,
  selectionBorderColor: "blue"
});
canvas.on({
  "object:moving": function (e) {
    e.target.opacity = 0.5;
  },
  "object:modified": function (e) {
    e.target.opacity = 1;
  },
  "object:selected": OnObjectSelected,
  "selection:cleared": OnSelectedCleared
});
// piggyback on `canvas.findTarget`, to fire "object:over" and "object:out" events
canvas.findTarget = (function (originalFn) {
  return function () {
    var target = originalFn.apply(this, arguments);
    if (target) {
      if (this._hoveredTarget !== target) {
        canvas.fire("object:over", { target: target });
        if (this._hoveredTarget) {
          canvas.fire("object:out", { target: this._hoveredTarget });
        }
        this._hoveredTarget = target;
      }
    }
    else if (this._hoveredTarget) {
      canvas.fire("object:out", { target: this._hoveredTarget });
      this._hoveredTarget = null;
    }
    return target;
  };
})(canvas.findTarget);

canvas.on("object:over", function (e) {
  //e.target.setFill("red");
  //canvas.renderAll();
});
canvas.on("object:out", function (e) {
  //e.target.setFill("green");
  //canvas.renderAll();
});
canvas.on("object:added", function (e) {
  RefreshDesign();
  RefreshPrice();
});
canvas.on("object:removed", function (e) {
  var a = 0;
  if (e.target.type === "image") {
    var nameFromServer = e.target._originalElement.src.split("_")[2];
    var name = getFileNameFromPath($("#PhotoUpload").val());
    if (nameFromServer == name) {
      $("#PhotoUpload").val("");
    }
  }
});

$(document).keyup(function (e) {
  //Escape or backspace
  if (e.keyCode == 46) {
    DeleteActiveObject();
    RefreshDesign();
    RefreshPrice();
  } else if (e.keyCode == 27) { //esc
    canvas.discardActiveGroup();
    canvas.discardActiveObject();
    //var activeGroup = canvas.getActiveGroup();
    //activeGroup.removeWithUpdate(theObject);
    canvas.renderAll();
  }
  return false;
});
$(document).mouseup(function (e) {

  var allowedArea = $("#DrawingArea,.editButtonGroup,#CustomText");

  // if the target of the click isn't the container nor a descendant of the container
  if (!allowedArea.is(e.target) && allowedArea.has(e.target).length === 0) {

    canvas.discardActiveGroup();
    canvas.discardActiveObject();
    //var activeGroup = canvas.getActiveGroup();
    //activeGroup.removeWithUpdate(theObject);
    canvas.renderAll();
  }
});
$("#AddText").on("click", function () {
  var text = $("#CustomText").val();

  if (inew(text)) {
    return false;
  }
  var textSample = new fabric.Text(text, {
    left: fabric.util.getRandomInt(0, 50),
    top: fabric.util.getRandomInt(0, 50),
    fontFamily: "helvetica",
    angle: 0,
    fill: "#000000",
    scaleX: 0.7,
    scaleY: 0.7,
    fontWeight: "",
    hasRotatingPoint: true
  });
  canvas.add(textSample);
  canvas.setActiveObject(textSample);
  canvas.item(canvas.item.length - 1).hasRotatingPoint = true;
  $(".txEditor").css("display", "block");
  $(".imgEditor").css("display", "block");
  canvas.renderAll();
  return false;
});

$("#CustomText").keyup(function (e) {
  var val = $("#CustomText").val();
  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "text") {
    if (ine(val)) {
      canvas.remove(activeObject);
      RefreshDesign();
      RefreshPrice();

    } else {

      activeObject.text = this.value;
      canvas.renderAll();
    }
  }

  if (e.keyCode === 13) { // 13 is enter key
    var activeObject = canvas.getActiveObject()
    if (activeObject == null)
      $("#AddText").click();
    e.preventDefault();
    return false;
  }
});

$("#RemoveSelected").on("click", function () {
  DeleteActiveObject();
  RefreshDesign();
  RefreshPrice();
  return false;
});
$("#ClearDesign").on("click", function () {
  canvas.clear();
  $("#PhotoUpload").val("");
  $("#SelectedImagePathListJson").val("");
  $("#DesignFront").val("");

  $("#DesignBack").val("");
  RefreshPrice();
  return false;
});
$("#BringToFront").on("click", function () {
  var activeObject = canvas.getActiveObject(),
    activeGroup = canvas.getActiveGroup();
  if (activeObject) {
    activeObject.bringToFront();
  }
  else if (activeGroup) {
    var objectsInGroup = activeGroup.getObjects();
    canvas.discardActiveGroup();
    objectsInGroup.forEach(function (object) {
      object.bringToFront();
    });
  }
  return false;
});
$("#SendToBack").on("click", function () {
  var activeObject = canvas.getActiveObject(),
    activeGroup = canvas.getActiveGroup();
  if (activeObject) {
    activeObject.sendToBack();
  }
  else if (activeGroup) {
    var objectsInGroup = activeGroup.getObjects();
    canvas.discardActiveGroup();
    objectsInGroup.forEach(function (object) {
      object.sendToBack();
    });
  }
  return false;
});
$("#TextBold").click(function () {
  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "text") {
    //activeObject.fontWeight = (activeObject.fontWeight == "bold" ? "" : "bold");
    var boldProperty = activeObject.fontWeight == "bold" ? "" : "bold";
    activeObject.set({ fontWeight: boldProperty })
    canvas.renderAll();
  }
  return false;

});
$("#TextItalic").click(function () {
  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "text") {
    var italicProperty = activeObject.fontStyle == "italic" ? "" : "italic";
    activeObject.set({ fontStyle: italicProperty })
    canvas.renderAll();
  }
  return false;
});
$("#TextStrike").click(function () {
  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "text") {
    //activeObject.textDecoration = (activeObject.textDecoration == "line-through" ? "" : "line-through");
    var deco = activeObject.textDecoration == "line-through" ? "" : "line-through";
    activeObject.set({ textDecoration: deco })
    canvas.renderAll();
    //canvas.trigger("object:modified", { target: activeObject }); gerek kalmadı
  }
  return false;
});
$("#TextUnderline").click(function () {
  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "text") {
    //activeObject.textDecoration = (activeObject.textDecoration == "underline" ? "" : "underline");
    var deco = activeObject.textDecoration == "underline" ? "" : "underline"
    activeObject.set({ textDecoration: deco })
    canvas.renderAll();
  }
  return false;
});

$("#FontFamily").change(function () {

  var activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "text") {
    activeObject.fontFamily = this.value;
    canvas.renderAll();
  }
  return false;
});
$("#TextFontColor").minicolors({
  change: function (hex, rgb) {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "text") {
      activeObject.set({ fill: hex })
      //activeObject.fill = this.value;
      canvas.renderAll();
    }
  },
  open: function (hex, rgb) {
    //
  },
  close: function (hex, rgb) {
    //
  }
});
$("#TextStrokecolor").minicolors({
  change: function (hex, rgb) {
    var activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "text") {
      //activeObject.strokeStyle = this.value;
      activeObject.set({ stroke: hex }) //strokeWidth : 15
      canvas.renderAll();
    }
  },
  open: function (hex, rgb) {
    //
  },
  close: function (hex, rgb) {
    //
  }
});

$(".colorPreview").click(function () {
  if ($(this).hasClass("disabled") == true) {
    return false;
  }
  else {

    var color = $(this).css("background-color");
    $("#Color").val(color);
    document.getElementById("shirtDiv").style.backgroundColor = color;
  }
});
var renderPattern = function () { }

$("#Flip").click(function () {
  //if ($(this).attr("data-original-title") == "Back") {
  var side = GetTshirtSide();
  if (side == 1) {
    ShowBack();

  } else if (side == 0) {
    ShowFront();
  }
  canvas.renderAll();
  setTimeout(function () {
    canvas.calcOffset();
  }, 200);
});
$(".clearfix button,a,.colorPreview").tooltip();
$("#ProductTypeList").on("change", function () {
  $("#ProductType").val($("#ProductTypeList :selected").val());
  $("#ProductTypeText").text($("#ProductTypeList :selected").text());
  //var src = $("#TshirtFacing").attr("src");
  var src = $("#ProductTypeList:selected").data("front");
  //var newSrc = src.replace(image, src);
  $("#TshirtFacing").attr("src", src);
  ShowFront();
  RefreshPrice();
})

$("#CategoryList").on("change", function () {
  var selectedValue = $("#CategoryList :selected").val()
  $("#CategoryId").val(selectedValue);
});
$("#SizeList").on("change", function () {
  $("#Size").val($("#SizeList :selected").val());
});
$("#Size").val($("#SizeList :selected").val())

$("#PhotoUpload").on("change", function (e) {
  var file = e.target.files[0];
  if (isnull(file)) return false;
  if (file.size > 1048576 * 6) {
    alert("Maksimum resim boyutu 6 MB' tır!", false)
    $element.val("");
    return false;
  }
  var formData = new FormData($("form#DesignYourselfForm")[0]);
  var success = function (r) {
    if (isTrue(r.IsSuccess) && !ine(r.Object)) {
      var imageObj = r.Object;
      imageUrl = imageObj.Url;
      imageWidth = imageObj.Width;
      imageHeight = imageObj.Height;
      alert("Resim yüklendi!", true);
      var imageName = getFileNameFromPath($("#PhotoUpload").val());
      //resim canvasa atma
      var left = 0;//fabric.util.getRandomInt(0, 22);
      var top = 20;//fabric.util.getRandomInt(30, 55);
      var calculatedScaleX = 1 / (imageWidth / 200);
      var calculatedScaleY = 1 / (imageHeight / 400);
      var optimizedScale = calculatedScaleX < calculatedScaleY ? calculatedScaleX : calculatedScaleY;
      fabric.Image.fromURL(imageUrl, function (image) {
        image.set({
          left: left,
          top: top,
          angle: 0,
          padding: 0,
          cornersize: 10,
          hasRotatingPoint: true
        }).scale(optimizedScale);
        //image.scale(getRandomNum(0.1, 0.25)).setCoords();
        canvas.add(image);
        canvas.setActiveObject(image);
      });
    }
    else {
      alert(r.Message, false);
    }
  }
  alert("formData is sent by ajax")

})
$("ul.fontSelection li").on("click", function () {
  var selectedFont = $(this).text();
  SetFont(selectedFont);
})
$("#AddToCart").click(function () {
    alert("added")
})
$("#TagsInside").on('keydown', function (e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode == 9) {
    setTimeout(function () {
      $(".bootstrap-tagsinput")[0].click();
    }, 100);

  }
});


$("#ProductTypeText").text($("#ProductTypeList :selected").text());
$("#ProductType").val($("#ProductTypeList :selected").val());
RefreshPrice();
$(".txEditor").css("display", "none");
$(".imgEditor").css("display", "none");


  $(".img-polaroid").click(function (e) {
    var el = e.target;
    var left = 0;
    var top = 20;

    var imageSrcW = $(this).data("width");
    var imageSrcH = $(this).data("height");
    var imageWidth = imageSrcW;
    var imageHeight = imageSrcH;
    var calculatedScaleX = 1 / (imageWidth / 200);
    var calculatedScaleY = 1 / (imageHeight / 400);
    var optimizedScale = calculatedScaleX < calculatedScaleY ? calculatedScaleX : calculatedScaleY;
    var url = el.src;
    var path = new URL(url).pathname;
    fabric.Image.fromURL(path, function (image) {
      image.set({
        left: left,
        top: top,
        angle: 0,
        padding: 0,
        cornersize: 10,
        hasRotatingPoint: true
      }).scale(optimizedScale);
      //image.scale(getRandomNum(0.1, 0.25)).setCoords();
      canvas.add(image);
      canvas.setActiveObject(image);
    });


  });
