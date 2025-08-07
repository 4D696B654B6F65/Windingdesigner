
var canvas = document.querySelector('canvas');
var scale = 3; //pixles per mm

const panel = document.getElementById('panel');
const panelWidth = panel.getBoundingClientRect().width;

canvas.width = window.innerWidth*0.999-panelWidth;
canvas.height = window.innerHeight*0.999;


var c = canvas.getContext('2d');
maindraw();

export function maindraw(){

c.clearRect(0, 0, canvas.width, canvas.height);
scale = document.getElementById('scale').value;

draw_motor_canvas(c,scale);

}

window.addEventListener('resize',function()
{
                    canvas.height = window.innerHeight*0.999;
                     if (panel.classList.contains('collapsed')) {
                        // Panel is collapsed, set canvas width to 0.999
                        canvas.width = window.innerWidth*0.999;
                        maindraw();
                    } else {
                        // Panel is expanded, set canvas width to 0.849

                        canvas.width = window.innerWidth*0.999-panelWidth;
                        maindraw();
                    }
}
)

const inputs = document.querySelectorAll('form input');

    // Add an event listener to each input
    inputs.forEach(input => {
        input.addEventListener('input', event => {
            if (plausibilitycheck())
            {
            maindraw();
            }
        });
    });

document.getElementById("VariantUP").addEventListener("click", VariantUpFunct);
function VariantUpFunct() {
  if (parseInt(document.getElementById("Variant").innerHTML,10) +1 <= parseInt(document.getElementById("noVariants").innerHTML,10))
  {
  document.getElementById("Variant").innerHTML = parseInt(document.getElementById("Variant").innerHTML,10)+1;
  }
  else
  {document.getElementById("Variant").innerHTML = 1;}
  maindraw();
}

document.getElementById("VariantDown").addEventListener("click", VariantDownFunct);
function VariantDownFunct() {
  if (parseInt(document.getElementById("Variant").innerHTML,10) -1 > 0)
  {
  document.getElementById("Variant").innerHTML = parseInt(document.getElementById("Variant").innerHTML,10)-1;
  }
  else
  {document.getElementById("Variant").innerHTML = parseInt(document.getElementById("noVariants").innerHTML,10);}
  maindraw();
}

function plausibilitycheck()
{
    if (document.getElementById("slots").value < 3)
    {
        return false;
    }
    else if (document.getElementById("pole_pairs").value < 1)
    {
        return false;
    }
    else if (document.getElementById("layers").value < 1)
    {
        return false;
    }
    else if (document.getElementById("strands").value < 1)
    {
        return false;
    }
    else if (document.getElementById("scale").value < 1)
    {
        return false;
    }
    else
    {return true}

}

