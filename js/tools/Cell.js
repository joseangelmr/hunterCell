document.write('<script type="text/javascript" src="js/tools/HashMap.js" ></script>');
document.write('<script type="text/javascript" src="js/tools/HotspotReg.js" ></script>');



//variables
var hotspots_in_cell = [];
var THRESHOLD_TO_BELEIVE_AP_IS_STILL_IN_CELL = 3;
var THRESHOLD_TO_ADD_AP_TO_CELL = 2;
var hotspots_in_reg = new HashMap();
var mapa = new HashMap();
window.hotspots_in_reg = window.hotspots_in_reg || {};
window.hotspots_in_cell = window.hotspots_in_cell || {};
window.THRESHOLD_TO_BELEIVE_AP_IS_STILL_IN_CELL = window.THRESHOLD_TO_BELEIVE_AP_IS_STILL_IN_CELL || {};
window.THRESHOLD_TO_ADD_AP_TO_CELL = window.THRESHOLD_TO_ADD_AP_TO_CELL || {};





function create_Hotspot_reg( macAddress, scanNumber) {
        var hotspotReg = new HotspotReg();
        hotspotReg.appeared = 1;
        hotspotReg.macAddress = macAddress;
        hotspotReg.disappeared = 0;
        hotspotReg.inCell = 0;
        hotspotReg.inLeg = 1;
        hotspotReg.id= Object.keys(window.hotspots_in_reg._dict).length;
        hotspotReg.active = scanNumber;
        window.hotspots_in_reg.put(macAddress, hotspotReg);
        // console.log("agregado "+ JSON.stringify(hotspots_in_reg.get(macAddress)) + " tamano "+ Object.keys(hotspots_in_reg._dict).length );
        return hotspotReg;
};

function update_Hotspot_in_cell( hotspotReg, scanNumber) {
    //        hotspotReg.history.set(scanNumber, true);
        hotspotReg.appeared++;

        if (hotspotReg.appeared > 2) {
            // Do I have to check last status of the bitarray to detect appearance?
            hotspotReg.disappeared = 0;
        }
        hotspotReg.inCell++;
        hotspotReg.inLeg++;
        hotspotReg.active = scanNumber;
};

function update_Hotspot_out_of_cell( hotspotReg, scanNumber) {
    //        hotspotReg.history.set(scanNumber, true);
        hotspotReg.appeared++;

        if (hotspotReg.appeared >= THRESHOLD_TO_ADD_AP_TO_CELL) {
            window.hotspots_in_cell.push(hotspotReg.macAddress);
            hotspotReg.inCell++;
            hotspotReg.disappeared = 0 ;
        }

        hotspotReg.inLeg++;
        hotspotReg.active = scanNumber;
};

function update_partial_disappear(hotspotReg, scanNumber) {
    //        hotspotReg.history.set(scanNumber, false);
        hotspotReg.disappeared++;
        hotspotReg.appeared = 0;


        if (hotspotReg.disappeared < THRESHOLD_TO_BELEIVE_AP_IS_STILL_IN_CELL) {
            hotspotReg.inCell++;
        } else {
            // be careful when invoked many times for many checks because the AP is removed the
            // first time.
            // window.hotspots_in_cell.splice(window.hotspots_in_cell.indexOf(hotspotReg.macAddress), 1);
            // window.hotspots_in_cell.remove(hotspotReg.macAddress);

            var cell = [];

            for (var a = 0 ; a < window.hotspots_in_cell.length; a++){

                if (window.hotspots_in_cell[a]!==hotspotReg.macAddress)
                    cell.push(hotspots_in_cell[a]);

            }
            window.hotspots_in_cell = cell;
            // console.log(" elimino "+ hotspotReg.macAddress);


        }

        // console.log(hotspotReg.disappeared);
};