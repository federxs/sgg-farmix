(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarUsuariosController', consultarUsuariosController);

    consultarUsuariosController.$inject = ['$scope', 'consultarUsuariosService', 'toastr', 'exportador', '$localStorage'];

    function consultarUsuariosController($scope, consultarUsuariosService, toastr, exportador, $localStorage) {
        var vm = $scope;
        vm.showSpinner = true;
        vm.deshabilitar = false;
        vm.disabledExportar = 'disabled';
        //variables
        vm.usuarios = [];
        vm.filtro = {};

        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.exportarExcel = exportarExcel;
        vm.exportarPDF = exportarPDF;

        function inicializar() {
            vm.showSpinner = true;
            vm.deshabilitar = true;
            vm.disabledExportar = 'disabled';
            vm.itemsPorPagina = 9;
            consultarUsuariosService.inicializar().then(function success(data) {
                vm.roles = data.roles;
                vm.filtro.idRol = '0';
                consultar();
            }, function error(error) {
                vm.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function consultar() {
            vm.showSpinner = true;
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            //if (isUndefinedOrNull(vm.filtro.nombre)) vm.filtro.nombre = '';
            //if (isUndefinedOrNull(vm.filtro.apellido)) vm.filtro.apellido = '';
            //if (isUndefinedOrNull(vm.filtro.idRol)) vm.filtro.idRol = '';
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            consultarUsuariosService.obtenerListaUsuarios(vm.filtro).then(function success(data) {
                if (data.length === 0) {
                    vm.rowCollection = [];
                    toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
                }                    
                else {
                    vm.rowCollection = data;
                    vm.deshabilitar = false;
                    vm.disabledExportar = '';
                }
                vm.showSpinner = false;                
            }, function error(error) {
                vm.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function limpiarCampos() {
            vm.filtro = {};
            vm.filtro.nombre = '';
            vm.filtro.apellido = '';
            vm.filtro.idRol = '0';
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            consultar();
        }

        function exportarExcel() {
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Usuario';
            filtro.Titulos[1] = 'Nombre';
            filtro.Titulos[2] = 'Apellido';
            filtro.Titulos[3] = 'Fecha Alta';
            filtro.Titulos[4] = 'Fecha Baja';

            var titulos = [];
            titulos[0] = 'Usuario';
            titulos[1] = 'Nombre';
            titulos[2] = 'Apellido';
            titulos[3] = 'Fecha Alta';
            titulos[4] = 'Fecha Baja';

            var propiedades = [];
            propiedades[0] = "usuario"
            propiedades[1] = "nombre";
            propiedades[2] = "apellido";
            propiedades[3] = "fechaAlta";
            propiedades[4] = "fechaBaja";

            if (vm.rowCollection.length > 0) {
                var i = 1;
                if (vm.filtro.numCaravana === undefined)
                    filtro[0] = '';
                else
                    filtro[0] = vm.filtro.numCaravana;
                for (var property in vm.filtro) {
                    var type = typeof vm.filtro[property];
                    if ((vm.filtro[property] === null || type !== "object") && property !== "$resolved" && type !== "function" && property !== "numCaravana") {
                        if (property === "idCategoria") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.categorias.length; j++) {
                                    if (vm.filtro[property] === vm.categorias[j].idCategoria || parseInt(vm.filtro[property]) === vm.categorias[j].idCategoria) {
                                        filtro[i] = vm.categorias[j].nombre;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "genero") {
                            if (vm.filtro[property] === '2') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else if (vm.filtro[property] === '0') {
                                filtro[i] = 'Hembra';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Macho';
                                i += 1;
                            }
                        }
                        else if (property === "idRaza") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.razas.length; j++) {
                                    if (vm.filtro[property] === vm.razas[j].idRaza || parseInt(vm.filtro[property]) === vm.razas[j].idRaza) {
                                        filtro[i] = vm.razas[j].nombre;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "idRodeo") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.rodeos.length; j++) {
                                    if (vm.filtro[property] === vm.rodeos[j].idRodeo || parseInt(vm.filtro[property]) === vm.rodeos[j].idRodeo) {
                                        filtro[i] = vm.rodeos[j].nombre;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "idEstado") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.estados.length; j++) {
                                    if (vm.filtro[property] === vm.estados[j].idEstado || parseInt(vm.filtro[property]) === vm.estados[j].idEstado) {
                                        filtro[i] = vm.estados[j].nombre;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "accionPeso") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else if (vm.filtro[property] === 'mayor') {
                                filtro[i] = 'Mayor';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Menor';
                                i += 1;
                            }
                        }
                        else {
                            filtro[i] = $scope.filtro[property];
                            i += 1;
                        }
                    }
                }
                if (vm.filtro.peso === undefined)
                    filtro[filtro.length] = '';
                var fecha = new Date();
                fecha = convertirFecha(fecha);
                exportador.exportarExcel('Bovinos' + fecha, vm.rowCollection, titulos, filtro, propiedades, 'Bovinos', function () {
                    toastr.success("Se ha exportado con Éxito", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function exportarPDF() {
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Usuario';
            filtro.Titulos[1] = 'Nombre';
            filtro.Titulos[2] = 'Apellido';
            filtro.Titulos[3] = 'Fecha Alta';
            filtro.Titulos[4] = 'Fecha Baja';

            var propiedades = [];
            propiedades[0] = "usuario"
            propiedades[1] = "nombre";
            propiedades[2] = "apellido";
            propiedades[3] = "fechaAlta";
            propiedades[4] = "fechaBaja";

            if (vm.rowCollection.length > 0) {
                var i = 1;
                if (vm.filtro.numCaravana === undefined)
                    filtro[0] = '';
                else
                    filtro[0] = vm.filtro.numCaravana;
                for (var property in vm.filtro) {
                    var type = typeof vm.filtro[property];
                    if ((vm.filtro[property] === null || type !== "object") && property !== "$resolved" && type !== "function" && property !== "numCaravana") {
                        if (property === "idCategoria") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.categorias.length; j++) {
                                    if (vm.filtro[property] === vm.categorias[j].idCategoria || parseInt(vm.filtro[property]) === vm.categorias[j].idCategoria) {
                                        filtro[i] = vm.categorias[j].nombre;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "genero") {
                            if (vm.filtro[property] === '2') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else if (vm.filtro[property] === '0') {
                                filtro[i] = 'Hembra';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Macho';
                                i += 1;
                            }
                        }
                        else if (property === "idRaza") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.razas.length; j++) {
                                    if (vm.filtro[property] === vm.razas[j].idRaza || parseInt(vm.filtro[property]) === vm.razas[j].idRaza) {
                                        filtro[i] = vm.razas[j].nombre;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "idRodeo") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.rodeos.length; j++) {
                                    if (vm.filtro[property] === vm.rodeos[j].idRodeo || parseInt(vm.filtro[property]) === vm.rodeos[j].idRodeo) {
                                        filtro[i] = vm.rodeos[j].nombre;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "idEstado") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.estados.length; j++) {
                                    if (vm.filtro[property] === vm.estados[j].idEstado || parseInt(vm.filtro[property]) === vm.estados[j].idEstado) {
                                        filtro[i] = vm.estados[j].nombre;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "accionPeso") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else if (vm.filtro[property] === 'mayor') {
                                filtro[i] = 'Mayor';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Menor';
                                i += 1;
                            }
                        }
                        else {
                            filtro[i] = $scope.filtro[property];
                            i += 1;
                        }
                    }
                }
                if (vm.filtro.peso === undefined)
                    filtro[filtro.length] = '';
                var fecha = new Date();
                fecha = convertirFecha(fecha);

                var tab_text = '<html><head></head><body>';
                tab_text += "<h1 style='align:center;'>Bovinos</h1>";
                tab_text = tab_text + "<div><table border='1px' style='font-size:6px; width:6000px;'>";
                //tab_text += "<tr><td style='text-align:center; font-size:20px' colspan='" + titulos.length + "'><b>" + tituloReporte + "</b></td></tr>" + "<tr></tr>";
                if (vm.filtro !== null) {
                    var $html_filtro = "<thead><tr>";
                    for (var i = 0; i < filtro.Titulos.length; i++) {
                        $html_filtro += "<td bgcolor='black' style='text-align:center; vertical-align:center'><b><font color='white'>" + filtro.Titulos[i] + "</font></b></td>";
                    }
                    $html_filtro += "</tr></thead>";
                    var $body = "<tr>";
                    for (var i = 0; i < filtro.length; i++) {
                        if (filtro[i] === null || typeof filtro[i] !== "object") {
                            var campo = filtro[i] !== null ? filtro[i] : "";
                            $body += "<td style='text-align:center; vertical-align:center'> " + campo + " </td>";
                        }
                    }
                    $body += "</tr></tbody>";
                    var newhtml_filtro = $html_filtro.concat($body.toString()).concat("</table></div>");
                    tab_text = tab_text + newhtml_filtro.toString();
                    //tab_text = tab_text + "<tr></tr>" + "<tr></tr>";
                }
                tab_text += "<div style='border-width: 2px; border-style: dotted; padding: 1em; font-size:120%;line-height: 1.5em;'><table border='1px' style='font-size:5px; width:6000px'>";
                var $html = "<thead><tr>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Nro Caravana</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Categoría</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Sexo</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Raza</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Rodeo</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Estado</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Peso</font></b></td>";
                $html += "</tr></thead><tbody>";
                var $body = "<tr>";
                var data = vm.rowCollection;
                for (var j = 0; j < data.length; j++) {
                    for (var property in data[j]) {
                        if (data[j].hasOwnProperty(property) && property !== "$$hashKey") {
                            if (propiedades.indexOf(property) > -1) {
                                var campo = data[j][property] !== "" ? data[j][property] : "";
                                $body += "<td style='text-align:center; vertical-align:center'> " + campo + " </td>";
                            }
                        }
                        else {
                            $body += "</tr>";
                            break;
                        }
                    }
                }
                tab_text += "</tbody>";
                var newhtml = $html.concat($body.toString()).concat("</table></div>");
                tab_text = tab_text + newhtml.toString();
                tab_text = tab_text + '</body></html>';

                exportador.exportarPDF('Bovinos' + fecha, tab_text, function () {
                    toastr.success("Se ha exportado con Éxito.", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = (fecha.getMonth() + 1).toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        }

        function isUndefinedOrNull(val) {
            return angular.isUndefined(val) || val === null || val == undefined
        }

    }
})();