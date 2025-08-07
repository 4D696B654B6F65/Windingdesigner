

function draw_motor_canvas(c,scale) {

    var canvas = document.querySelector('canvas');
    var pole_number = 2*document.getElementById('pole_pairs').value;
    var slot_number = document.getElementById('slots').value;
    var strand_number = document.getElementById('strands').value;
    var layer_number = document.getElementById('layers').value;
    var outer_radius = 70;
    var inner_radius = 45;
    var slot_opening = 2;
    var tooth_width = 3;
    tooth_width = inner_radius*2*Math.PI/slot_number/2;
    var tooth_height = 20;
    var padding = 100;
    var head_height = 2;
    var tooth_wedge = 4;

    plotGrid()

    if (panel.classList.contains('collapsed'))
    {
        var extrapad = 40;
    }
    else
    {
    var extrapad = 0;
    }
    var ref_x = outer_radius*scale+padding;
    var ref_y = outer_radius*scale+padding+extrapad+(layer_number*20)-40;

    c.beginPath();
    c.arc(ref_x,ref_y,outer_radius*scale,0,Math.PI*2,false)
    c.fillStyle = "#404040";
    c.strokeStyle = "#CCCCCC";
    c.lineWidth = 3;
    c.stroke();
    c.fill();

    var closed_angle = Math.PI/slot_number - Math.asin(slot_opening/2/inner_radius);
    var y_offset = inner_radius*scale*Math.sin(closed_angle);

    for (let i = 0; i < slot_number; i++) {
    //i = 0;
    c.beginPath();
    c.fillStyle = "#181818";
    c.strokeStyle = "#CCCCCC";
    c.lineWidth = 3;
    c.arc(ref_x,ref_y,inner_radius*scale,-closed_angle+i*2*Math.PI/slot_number,closed_angle+i*2*Math.PI/slot_number,false)
    c.stroke();

    var x = ref_x + Math.cos(closed_angle+i*2*Math.PI/slot_number)*inner_radius*scale+ Math.cos(i*2*Math.PI/slot_number)*head_height*scale; //+head_height+
    var y = ref_y + Math.sin(closed_angle+i*2*Math.PI/slot_number)*inner_radius*scale+ Math.sin(i*2*Math.PI/slot_number)*head_height*scale;
    c.lineTo(x,y)
    c.stroke();

    x = x + (tooth_wedge)*scale*Math.cos(i*2*Math.PI/slot_number)+(y_offset-tooth_width*scale/2)*Math.sin(i*2*Math.PI/slot_number);
    y = y - (y_offset-tooth_width*scale/2)*Math.cos(i*2*Math.PI/slot_number)+tooth_wedge*scale*Math.sin(i*2*Math.PI/slot_number);
    c.lineTo(x,y)
    c.stroke();

    x = x + (tooth_height-head_height-tooth_wedge)*scale*Math.cos(i*2*Math.PI/slot_number) ;
    y = y + (tooth_height-head_height-tooth_wedge)*scale*Math.sin(i*2*Math.PI/slot_number) ;
    c.lineTo(x,y)
    c.stroke();

    var help_rad = Math.sqrt((x-ref_x)*(x-ref_x)+(y-ref_y)*(y-ref_y))

    //var help_angle = ((Math.atan((y-ref_y)/(x-ref_x)) % (2*Math.PI/slot_number))+2*Math.PI/slot_number) % (2*Math.PI/slot_number);
    var help_angle = ((Math.atan2((y-ref_y),(x-ref_x))+2*Math.PI) % (2*Math.PI))% (2*Math.PI/slot_number) ;

    //Outer Arc
    c.arc(ref_x,ref_y,help_rad,help_angle+(i)*2*Math.PI/slot_number,(i+1)*2*Math.PI/slot_number-help_angle,false)
    c.stroke();

    x = ref_x + help_rad*(Math.cos((i+1)*2*Math.PI/slot_number-help_angle));
    y = ref_y + help_rad*(Math.sin((i+1)*2*Math.PI/slot_number-help_angle));

    x = x - (tooth_height-head_height-tooth_wedge)*scale*Math.cos((i+1)*2*Math.PI/slot_number) ;
    y = y - (tooth_height-head_height-tooth_wedge)*scale*Math.sin((i+1)*2*Math.PI/slot_number) ;
    c.lineTo(x,y)
    c.stroke();

    x = x - (tooth_wedge)*scale*Math.cos((i+1)*2*Math.PI/slot_number)+(y_offset-tooth_width*scale/2)*Math.sin((i+1)*2*Math.PI/slot_number);
    y = y - (y_offset-tooth_width*scale/2)*Math.cos((i+1)*2*Math.PI/slot_number)-tooth_wedge*scale*Math.sin((i+1)*2*Math.PI/slot_number);
    c.lineTo(x,y)
    c.stroke();

    var x = x - Math.cos((i+1)*2*Math.PI/slot_number)*head_height*scale; //+head_height+
    var y = y - Math.sin((i+1)*2*Math.PI/slot_number)*head_height*scale;
    c.lineTo(x,y)
    c.stroke();
    c.fill();

    c.beginPath();
    c.arc(ref_x,ref_y,inner_radius*scale-2,0,Math.PI*2,false)
    c.fillStyle = "#181818";
    c.strokeStyle = "#181818";
    c.lineWidth = 0;
    c.stroke();
    c.fill();
  }

    //Draw Pole
    var airgap = 1;
    var magnet_height = 5;

    for (let i = 0; i < pole_number; i++) {
    c.beginPath();
    c.arc(ref_x,ref_y,(inner_radius-airgap)*scale-1,i*Math.PI*2/pole_number,(i+1)*Math.PI*2/pole_number,false)

    if (i % 2 ){
  c.fillStyle = "#99ccff";
} else {
  c.fillStyle = "#ff99cc";
}

    c.strokeStyle = "#AAAAAA";
    c.lineWidth = 2;
    c.stroke();

    c.arc(ref_x,ref_y,(inner_radius-airgap-magnet_height)*scale-1,(i+1)*Math.PI*2/pole_number,(i)*Math.PI*2/pole_number,true)
    c.lineWidth = 2;
    c.stroke();
    c.fill();

    }

 // Draw winding
    var variant = document.getElementById("Variant").innerHTML-1;
    var layerplans = [];
    var layerplan =[];
    layerplans = MainWindingdesign();
    document.getElementById("noVariants").innerHTML = layerplans.length;
    layerplan = layerplans[variant];

    const colorpalette = ["#000000", "#E69F00", "#56B4E9","	#009E73","#F0E442","#0072B2","#D55E00","#CC79A7"];

    for (let l = 0; l < layer_number; l++) {
    for (let i = 0; i < layerplan.length; i++) {
        c.beginPath();
        c.fillStyle = colorpalette[math.abs(layerplan[i][l])+1];
        c.strokeStyle = "#CCCCCC";
        c.lineWidth = 1;
        var layerradius = (inner_radius+head_height+(l+1)*(tooth_height-head_height)/(1+layerplan[1].length))*scale;
        c.arc(ref_x+layerradius*math.cos((i+0.5)*Math.PI*2/slot_number),ref_y+layerradius*math.sin((i+0.5)*Math.PI*2/slot_number),10,0,2*Math.PI,false)
        c.stroke();
        c.fill()

        if (math.sign(layerplan[i][l])*1 > 0 || Object.is(layerplan[i][l],0))
        {
            c.beginPath();
            c.fillStyle = 'black';
            c.arc(ref_x+layerradius*math.cos((i+0.5)*Math.PI*2/slot_number),ref_y+layerradius*math.sin((i+0.5)*Math.PI*2/slot_number),2,0,2*Math.PI,false)
            c.stroke();
            c.fill()
        }
        else
        {
            c.strokeStyle = 'black';
            c.lineWidth = 2;
            c.beginPath()
            c.lineTo(ref_x+layerradius*math.cos((i+0.5)*Math.PI*2/slot_number),ref_y+layerradius*math.sin((i+0.5)*Math.PI*2/slot_number));
            c.lineTo(ref_x+layerradius*math.cos((i+0.5)*Math.PI*2/slot_number)+10/2/math.sqrt(2),ref_y+layerradius*math.sin((i+0.5)*Math.PI*2/slot_number)+10/2/math.sqrt(2));
            c.stroke();

            c.beginPath()
            c.lineTo(ref_x+layerradius*math.cos((i+0.5)*Math.PI*2/slot_number),ref_y+layerradius*math.sin((i+0.5)*Math.PI*2/slot_number));
            c.lineTo(ref_x+layerradius*math.cos((i+0.5)*Math.PI*2/slot_number)-10/2/math.sqrt(2),ref_y+layerradius*math.sin((i+0.5)*Math.PI*2/slot_number)+10/2/math.sqrt(2));
            c.stroke();

            c.beginPath()
            c.lineTo(ref_x+layerradius*math.cos((i+0.5)*Math.PI*2/slot_number),ref_y+layerradius*math.sin((i+0.5)*Math.PI*2/slot_number));
            c.lineTo(ref_x+layerradius*math.cos((i+0.5)*Math.PI*2/slot_number)-10/2/math.sqrt(2),ref_y+layerradius*math.sin((i+0.5)*Math.PI*2/slot_number)-10/2/math.sqrt(2));
            c.stroke();

            c.beginPath()
            c.lineTo(ref_x+layerradius*math.cos((i+0.5)*Math.PI*2/slot_number),ref_y+layerradius*math.sin((i+0.5)*Math.PI*2/slot_number));
            c.lineTo(ref_x+layerradius*math.cos((i+0.5)*Math.PI*2/slot_number)+10/2/math.sqrt(2),ref_y+layerradius*math.sin((i+0.5)*Math.PI*2/slot_number)-10/2/math.sqrt(2));
            c.stroke();

        }




    }
    }



    // Array Data
    var arrayData = [...layerplan];
    var helpchar = '0';

    for (let l = 0; l < layer_number; l++) {
    for (let i = 0; i < layerplan.length; i++) {

        //console.log(layerplan[i][l]);
        if (Object.is(layerplan[i][l],-0) || math.sign(layerplan[i][l]) == -1 )
        {
            helpchar = '-';
        }
        else
        {
            helpchar = '+';
        }
        arrayData[i][l] = helpchar + String.fromCharCode(65 + math.abs(layerplan[i][l]));
        //arrayData[i][l] = "a";
    }
    }


    generateTable(arrayData);;


    // Add Table to Container
    const tableContainer = document.getElementById("table-container");
    while (tableContainer.hasChildNodes())
    {
            tableContainer.removeChild(tableContainer.firstChild);
    }
    tableContainer.appendChild(generateTable(arrayData));
}

 function generateTable(data) {
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  // Transpose array and create table rows
  const maxColumns = Math.max(...data.map(row => row.length));

  for (let colIndex = 0; colIndex < maxColumns; colIndex++) {
    const tr = document.createElement("tr");

    data.forEach((row) => {
      const cellElement = document.createElement("td"); // Always create <td>
      cellElement.textContent = row[colIndex] !== undefined ? row[colIndex] : ""; // Handle undefined values
      tr.appendChild(cellElement);
    });

    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  return table;
    }

function plotGrid()
{
    var canvas = document.querySelector('canvas');
    var c = canvas.getContext('2d');
    var cwidth = canvas.width;
    var cheigth = canvas.height;
    var y = 0;
    var x = 0;
    var i = 0;
    while (y < cheigth)
    {
    i = i + 1;
    y = i*10*scale;
    if (i%10 == 0)
    {c.lineWidth = 1;}
    else
    {
    c.lineWidth = 0.1;
    }
    c.strokeStyle = "#CCCCCC";
    c.beginPath()
    c.lineTo(0,y)
    c.lineTo(cwidth,y)
    c.stroke();
    c.fill();
    }
    var i = 0;
    while (x < cwidth)
    {
    i = i + 1;
    x = i*10*scale;
    if (i%10 == 0)
    {c.lineWidth = 1;}
    else
    {
    c.lineWidth = 0.1;
    }
    c.strokeStyle = "#CCCCCC";
    c.beginPath()
    c.lineTo(x,cheigth)
    c.lineTo(x,0)
    c.stroke();
    c.fill();
    }

}