﻿import { jsPDF } from "jspdf"
var callAddFont = function () {
this.addFileToVFS('black-normal.ttf', font);
this.addFont('black-normal.ttf', 'black', 'normal');
};
jsPDF.API.events.push(['addFonts', callAddFont])