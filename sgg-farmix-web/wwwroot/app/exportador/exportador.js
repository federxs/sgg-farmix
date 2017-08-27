(function () {
    'use strict';

    angular.module('app').service('exportador', function () {
        var exportador = {};
        //metodo que recibe el titulo del archivo q se va a descargar, un object de datos, los titulos de las columnas del reporte, un obj filter q es opcional,
        //propiedades validas y el titulo del reporte
        exportador.exportarExcel = function (tituloArchivo, data, titulos, filter, prop, tituloReporte) {
            var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
            tab_text = tab_text + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';

            tab_text = tab_text + '<x:Name>Reporte</x:Name>';

            tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
            tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';

            tab_text = tab_text + "<table border='1px'>";
            tab_text += "<tr><td style='text-align:center; font-size:20px' colspan='" + titulos.length + "'><b>" + tituloReporte + "</b></td></tr>" + "<tr></tr>";
            if (filter !== null) {
                var $html_filtro = "<thead><tr>";
                for (var i = 0; i < filter.Titulos.length; i++) {
                    $html_filtro += "<td bgcolor='black' style='text-align:center;'><b><font color='white'>" + filter.Titulos[i] + "</font></b></td>";
                }
                $html_filtro += "</tr></thead>";
                var $body = "<tr>";
                for (var i = 0; i < filter.length; i++) {
                    if (filter[i] === null || typeof filter[i] !== "object") {
                        var campo = filter[i] !== null ? filter[i] : "";
                        $body += "<td style='text-align:center;'> " + campo + " </td>";
                    }
                }
                //for (var property in filter) {                    
                //    if (filter.hasOwnProperty(property) && property !== 'Emp_Id' && property !== '$promise' && property !== '$resolved' && typeof filter[property] !== "object" && property !== 'Tipo_PubId') {
                //        var campo = filter[property] !== null ? filter[property] : "";
                //        $body += "<td style='text-align:center;'> " + campo + " </td>";
                //    }
                //}
                $body += "</tr>";
                var newhtml_filtro = $html_filtro.concat($body.toString()).concat("</tbody>");
                tab_text = tab_text + newhtml_filtro.toString();
                tab_text = tab_text + "<tr></tr>" + "<tr></tr>";
            }

            var $html = "<thead><tr>";
            for (var i = 0; i < titulos.length; i++) {
                $html += "<td bgcolor='black' style='text-align:center;'><b><font color='white'>" + titulos[i] + "</font></b></td>";
                //<td style='text-align:center;'><b>Hoja de Ruta</b></td> <td style='text-align:center;'><b>Descripcion de la Ruta</b></td>  <td style='text-align:center;'><b>Periodo</b></td> <td style='text-align:center;'><b>Operador</b></td> <td style='text-align:center;'><b>Estado</b></td> <td style='text-align:center;'><b>Total</b></td> <td style='text-align:center;'><b>Pendientes</b></td></tr></thead>";
            }
            $html += "</tr></thead>";
            var $body = "<tr>";
            for (var j = 0; j < data.length; j++) {
                for (var property in data[j]) {
                    if (data[j].hasOwnProperty(property) && property !== "$$hashKey") {
                        if (prop.indexOf(property) > -1) {
                            var campo = data[j][property] !== "" ? data[j][property] : "";
                            $body += "<td style='text-align:center;'> " + campo + " </td>";
                        }
                    }
                    else {
                        $body += "</tr>";
                        break;
                    }

                }
                //$body = $body + "<tr><td style='text-align:center;'> " + tipoHojaRuta + " </td> <td style='text-align:center;'> " + hojaRuta + " </td> <td style='text-align:center;'> " + descripcion + " </td> <td style='text-align:center;'> " + periodo + " </td> <td style='text-align:center;'> " + operador + " </td> <td style='text-align:center;'> " + estado.toString() + " </td> <td style='text-align:center;'> " + total + " </td> <td style='text-align:center;'> " + pendientes + " </td> </tr>";
            }

            var newhtml = $html.concat($body.toString()).concat("</tbody>");
            tab_text = tab_text + newhtml.toString();
            var elemento = document.createElement('a');
            //var tabla = document.getElementById('tabla');
            //tabla.border = '1px';
            //var tabla_html = tabla.outerHTML;
            //tab_text += tabla_html;
            tab_text = tab_text + '</table></body></html>';
            var data_type = 'data:application/vnd.ms-excel,';
            elemento.href = data_type + escape(tab_text);
            elemento.download = tituloArchivo + '.xls';
            elemento.click();
        }

        //metodo que genera un archivo PDF recibiendo x parametro el nombre del Archivo q se va a descargar, el html con el q se va a armar el PDF
        // y el titulo q va a tener el PDF
        exportador.exportarPDF = function (tituloArchivo, html) {

            var specialElementHandlers = {
                '#bypassme': function (element, renderer) {
                    return true;
                }
            };
            var margins = {
                top: 60,
                bottom: 60,
                left: 40,
                width: 522
            };
            var pdf = new jsPDF('p', 'pt', 'a4');
            pdf.fromHTML(html, margins.left, margins.top, {
                'width': margins.width, 'margin': 1, 'pagesplit': true, 'elementHandlers': specialElementHandlers
            },
            function (dispose) {
                pdf.save(tituloArchivo + '.pdf');
            },
            margins
            )
        }
        return exportador;
    });
})();