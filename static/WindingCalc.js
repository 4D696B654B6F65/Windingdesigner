function MainWindingdesign()
{

var pole_number = 2*document.getElementById('pole_pairs').value;
    var slot_number = document.getElementById('slots').value;
    var strand_number = document.getElementById('strands').value;
    var layer_number = document.getElementById('layers').value;


    var phi_mag = [];
    var delta_phi_mag = [];


    //Define desired tooth magnetic complex potentials
    for (let k = 0; k < slot_number; k++) {
        phi_mag[k] = math.evaluate('1*exp(sqrt(-1)*2*PI*(k-1.5)*pole_number/2/slot_number)', { k: k, pole_number: pole_number,slot_number:slot_number });
        //console.log(phi_mag[k]);
    }

    //calculate tooth differences in magnetic complex potentials
    for (let k = 0; k < slot_number; k++) {
        delta_phi_mag[k] = math.subtract(phi_mag[((k+1) % slot_number)], phi_mag[k]);
        //console.log(delta_phi_mag[k]);
    }

    var mag = math.abs(delta_phi_mag[0])
    var i_abs = mag/layer_number;
    var f_el = 50;
    var time = 0;
    var i_angle_var = 1;
    if(document.getElementById('AngleVar').checked)
    {
         var i_angle_var = math.floor(360*2/slot_number);
    }
    var slot_plaene = [];
    var sp_number = 0;
    var slots;

    for (let u = 0; u < i_angle_var; u++) {

        ini_angle = (u/360*2*math.PI);
        //ini_angle = 0;

        var i_strand = [];

        for (let m = 0; m < strand_number; m++)
            {
                // define strand current based on initial value
                i_strand[m] = math.evaluate( 'i_abs*exp(i*(2*PI*f_el*time-(m-1)*(2-(0.5+0.5*(-1)^strand_number))*PI/strand_number+ini_angle))' , { i_abs: i_abs , f_el: f_el,time: time ,m: m, strand_number: strand_number , ini_angle: ini_angle });
            }
        slot_plaene[u] = generateSlotplan(i_strand,slot_number,strand_number,delta_phi_mag,layer_number);




    }
    var newplans = cleanUpSlotplan(slot_plaene,strand_number,layer_number);
    newplans = CheckSlotplane(newplans);

    var layerplan = [];
    for (let n = 0; n < newplans.length; n++)
    {
            layerplan[n] = generateLayerplan(newplans[n],strand_number,layer_number,slot_number);
    }
    return layerplan
    }

//console.log(slot_plaene);

function generateSlotplan(i_strand,slot_number,strand_number,delta_phi_mag,layer_number){
    var minval;
    var  slotpot;
    var val = 0;
    var help = 0;

    let slotplan = [];
    for (let c = 0; c < slot_number; c++) {
    slotplan[c] = []; // Initialize the subarray
    for (let k = 0; k < strand_number; k++) {
        slotplan[c][k] = 0; // Set each element to 0
    }
}

    for (let c = 0; c < slot_number ; c++) {
        minval = math.abs(delta_phi_mag[c]);
        for (let l = 0; l < layer_number ; l++) {
            slotpot = delta_phi_mag[c];
            for (let k = 0; k < strand_number ; k++) {
                slotpot = math.subtract(slotpot,math.multiply(slotplan[c][k],i_strand[k]));
            }
            val = 0;

            for (let k = 0; k < strand_number ; k++) {

                if (math.abs(math.subtract(slotpot,i_strand[k])) < minval)
                    {
                        minval = math.abs(math.subtract(slotpot,i_strand[k]));

                        help = k;
                        val = +1;
                    }
                if (math.abs(math.add(slotpot,i_strand[k])) < minval)
                    {
                        minval = math.abs(math.add(slotpot,i_strand[k]));

                        help = k;
                        val = -1;
                    }
            }
            slotplan[c][help] = slotplan[c][help]+val;
        }
    }
    return slotplan;
}

function cleanUpSlotplan(slot_plaene,strand_number,layer_number)
{
    //Checking for duplicates in slot plans
    var plan_number = slot_plaene.length;
    var newplans=[];
    newplans.push(slot_plaene[0]);
    var novel =1 ;
    var A = [];
    var B= [];
    var C = [];
    var bhelp = [];
    var brest = [];

    for (let u = 1; u < plan_number; u++)
        {
            novel = 1;

            B = slot_plaene[u]
            bhelp = structuredClone(B);

            for (let n = 0; n < newplans.length; n++)
            {
                A = newplans[n];
                //Check if duplicate in slotplan
                if(JSON.stringify(A) === JSON.stringify(B))
                {
                    novel = 0;
                }
                if(JSON.stringify(A) === JSON.stringify(B.map(row => row.map(element => element * -1))))
                {
                    novel = 0;
                }


                for (let r = 0; r < bhelp.length; r++)
                {
                    brest = bhelp.shift();
                    bhelp.push(brest);
                    //console.log(bhelp);

                if(JSON.stringify(A) === JSON.stringify(bhelp))
                {
                    novel = 0;
                }
                if(JSON.stringify(A) === JSON.stringify(bhelp.map(row => row.map(element => element * -1))))
                {
                    novel = 0;
                }

                }

            }


            if (novel == 1)
            {
            newplans.push(slot_plaene[u]);

            }
        }
 //console.log(newplans);
return newplans;
}

function CheckSlotplane(newplans)
{
            var newplans_windable = [];
            var Number_of_plans = newplans.length;
            for (let u = 0; u < Number_of_plans; u++)
            {
            var windable = 1;
            var symmetric = 1;
            if(document.getElementById('SortRes').checked)
            {
            // Check windability and symetry
            var slot_number_help = newplans[u].length;
            var strand_number_help = newplans[u][0].length;
            var sumWindable = 0;
            var absSumWindable = new Array(strand_number_help).fill(0);;
            for (let m = 0; m < strand_number_help; m++)
                {
                sumWindable = 0;
                for (let n = 0; n < slot_number_help; n++)
                {
                    sumWindable = sumWindable + newplans[u][n][m]

                    absSumWindable[m] += math.abs(newplans[u][n][m]);
                }
                if(sumWindable != 0 )
                {windable = 0;}
                }
                //&& )
                //const allEqual = arr => arr.every(val => val === arr[0]);

            symmetric = absSumWindable.every(val => val === absSumWindable[0])
            //console.log(absSumWindable)
            }

            if(windable && symmetric)
            {
                newplans_windable.push(newplans[u]);
            }
            }
            return newplans_windable
}

function generateLayerplan(newplan,strand_number,layer_number,slot_number)
{
//transpose array
    newplan = newplan[0].map((_, colIndex) =>
        newplan.map(row => row[colIndex])
    );

    //Define required number of layer parts for priority change
    var priothreshold_help = [];

    for (let i = 0; i < newplan.length; i++)
    {
        priothreshold_help[i] = math.max(math.abs(newplan[i]))
    }
    var priothreshold = math.min(priothreshold_help);

    let prio = []
    for (let m = 0; m < strand_number; m++) {
        prio[m] = 0;
    }


    let priolist = [];
    for (let c = 0; c < slot_number; c++)
    {
        priolist[c] = []; // Initialize the subarray
        for (let m = 0; m < strand_number; m++)
        {
            priolist[c][m] = m; // Set each element to m
        }
    }


    for (let c = 0; c < 2*slot_number; c++)
    {
        k = c % slot_number;
        for (let h = 0; h < strand_number; h++)
        {

        if(math.abs(newplan[h][k]) >= priothreshold && prio[0] != (h))
        {
            for (let m = 0; m < strand_number; m++)
            {
                prio[strand_number-(1+m)] = prio[strand_number-(2+m)];
            }
            prio[0] = h;
        }
        }
        priolist[k] = [...prio];
    }

     let layerplan = [];
    for (let c = 0; c < slot_number; c++)
    {
        layerplan[c] = []; // Initialize the subarray
        for (let l = 0; l < layer_number; l++)
        {
            layerplan[c][l] = l; // Set each element to m
        }
    }

var absnewplan = newplan.map(row => row.map(value => Math.abs(value)));

//console.log(absnewplan);

for (let c = 0; c < slot_number; c++)
    {
        layernum = 0;
        for (let m = 0; m < strand_number; m++)
        {
            o = priolist[c][m];
            //console.log(absnewplan[o][c]);

            while (absnewplan[o][c] > 0)
            {

                 layerplan[c][layernum] = priolist[c][m]*math.sign(newplan[o][c])
                 layernum = layernum+1;
                absnewplan[o][c] = absnewplan[o][c]-1;
            }
        }
    }
    //console.log(layerplan);

    return layerplan;
}

