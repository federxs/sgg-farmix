(function () {
    angular.module('app')
        .factory('consultarBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/BovinoConsultar/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/inicializar/:idAmbitoEstado/:idCampo',
                    headers: portalService.getHeadersServer(),
                    params: {
                        idAmbitoEstado: '@idAmbitoEstado',
                        idCampo: '@idCampo'
                    },
                    isArray: false
                },
                obtenerListaBovinos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/BovinoConsultar/getListaBovinos',
                    headers: portalService.getHeadersServer(),
                    isArray: true
                },
                validarCantBovinos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/verificarCantBovinosXAdmin',
                    params: {
                        usuario: '@usuario'
                    },
                    headers: portalService.getHeadersServer(),
                    isArray: false
                }
            });
        });
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarBovinoController', consultarBovinoController);

    consultarBovinoController.$inject = ['$scope', 'consultarBovinoService', 'toastr', 'exportador', '$localStorage', '$sessionStorage', '$state'];

    function consultarBovinoController($scope, consultarBovinoService, toastr, exportador, $localStorage, $sessionStorage, $state) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.disabled = 'disabled';
        vm.disabledExportar = 'disabled';
        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.exportarExcel = exportarExcel;
        vm.exportarPDF = exportarPDF;
        vm.validarCantBovinos = validarCantBovinos;
        vm.changeEstados = changeEstados;
        vm.changeCategorias = changeCategorias;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.rodeos = [];
        vm.establecimientos = [];
        vm.filtro = {};
        vm.cursor = '';
        var estados = [];
        var categorias = [];
        function inicializar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            vm.itemsPorPagina = 9;
            consultarBovinoService.inicializar({ idAmbitoEstado: '1', idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                vm.estados = data.estados;
                estados = angular.copy(data.estados);
                vm.categorias = data.categorias;
                categorias = angular.copy(data.categorias);
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
                vm.filtro.idCategoria = '0';
                vm.filtro.genero = '2';
                vm.filtro.idRaza = '0';
                vm.filtro.idRodeo = '0';
                vm.filtro.idEstado = '0';
                vm.filtro.accionPeso = '0';
                vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
                consultar();
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function consultar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            if (vm.filtro.peso === '' || vm.filtro.peso === undefined) vm.filtro.peso = 0;
            if (vm.filtro.numCaravana === '' || vm.filtro.numCaravana === null) vm.filtro.numCaravana = 0;
            consultarBovinoService.obtenerListaBovinos({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (data.length === 0) {
                    vm.disabledExportar = 'disabled';
                    //vm.showSpinner = false;
                    vm.disabled = '';
                    vm.rowCollection = [];
                    vm.filtro.peso = '';
                    toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                else {
                    vm.rowCollection = data;
                    if (vm.filtro.peso === 0) vm.filtro.peso = '';
                    if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                    //vm.showSpinner = false;
                    vm.disabled = '';
                    vm.disabledExportar = '';
                }
                $scope.$parent.unBlockSpinner();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function limpiarCampos() {
            vm.filtro = {};
            vm.filtro.idCategoria = '0';
            vm.filtro.genero = '2';
            vm.filtro.idRaza = '0';
            vm.filtro.idRodeo = '0';
            vm.filtro.idEstado = '0';
            vm.filtro.accionPeso = '0';
            vm.filtro.numCaravana = '';
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            consultar();
        }

        function exportarExcel() {
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Nro Caravana';
            filtro.Titulos[1] = 'Categoría';
            filtro.Titulos[2] = 'Sexo';
            filtro.Titulos[3] = 'Raza';
            filtro.Titulos[4] = 'Rodeo';
            filtro.Titulos[5] = 'Estado';
            filtro.Titulos[6] = 'Acción Peso';
            filtro.Titulos[7] = 'Peso (Kg)';

            var titulos = [];
            titulos[0] = "Nro Caravana";
            titulos[1] = "Categoría";
            titulos[2] = "Sexo";
            titulos[3] = "Raza";
            titulos[4] = "Rodeo";
            titulos[5] = "Estado";
            titulos[6] = "Peso (Kg)";

            var propiedades = [];
            propiedades[0] = "numCaravana";
            propiedades[1] = "categoriaNombre";
            propiedades[2] = "sexo";
            propiedades[3] = "razaNombre";
            propiedades[4] = "rodeoNombre";
            propiedades[5] = "estadoNombre";
            propiedades[6] = "peso";

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
            filtro.Titulos[0] = 'Nro Caravana';
            filtro.Titulos[1] = 'Categoría';
            filtro.Titulos[2] = 'Sexo';
            filtro.Titulos[3] = 'Raza';
            filtro.Titulos[4] = 'Rodeo';
            filtro.Titulos[5] = 'Estado';
            filtro.Titulos[6] = 'Acción Peso';
            filtro.Titulos[7] = 'Peso (Kg)';

            var propiedades = [];
            propiedades[0] = "numCaravana";
            propiedades[1] = "categoriaNombre";
            propiedades[2] = "sexo";
            propiedades[3] = "razaNombre";
            propiedades[4] = "rodeoNombre";
            propiedades[5] = "estadoNombre";
            propiedades[6] = "peso";

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

        function validarCantBovinos() {
            $scope.$parent.blockSpinner();
            consultarBovinoService.validarCantBovinos({ usuario: $sessionStorage.usuarioInfo.usuario }, function success(data) {
                if (data.resultado)
                    $state.go('home.registrarBovino');
                else {
                    $scope.$parent.unBlockSpinner();
                    toastr.info("No puede agregar mas bovinos, verifique su plan contratado.", "Aviso");
                }                    
                //$scope.$parent.unBlockSpinner();
            }, function error(error) {
                toastr.error("Se ha producido un error, reintentar.");
            });
        };

        function changeEstados() {
            if (vm.filtro.genero === '1') {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 1 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
            else if (vm.filtro.genero === '0') {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 0 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
        };

        function changeCategorias() {
            if (vm.filtro.genero === '1') {
                vm.categorias = [];
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 1)
                        vm.categorias.push(categorias[i]);
                }
            }
            else if (vm.filtro.genero === '0' || vm.filtro.genero === 0) {
                vm.categorias = [];
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 0)
                        vm.categorias.push(categorias[i]);
                }
            }
            else
                vm.categorias = categorias;
        };
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('detalleBovinoService', detalleBovinoService);

    detalleBovinoService.$inject = ['$http', 'portalService'];

    function detalleBovinoService($http, portalService) {
        var service = {
            inicializar: inicializar
        };

        function inicializar(idBovino) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Bovino/initDetalle',
                params: { idBovino: idBovino },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleBovinoController', detalleBovinoController);

    detalleBovinoController.$inject = ['$scope', 'detalleBovinoService', '$stateParams', 'toastr'];

    function detalleBovinoController($scope, detalleBovinoService, $stateParams, toastr) {
        var vm = $scope;
        window.scrollTo(0, 0);
        //funciones
        vm.inicializar = inicializar;
        //variables
        vm.bovino = {};
        vm.checkH = false;
        vm.checkM = false;
        vm.volver = 'home.bovino';

        inicializar();

        function inicializar() {
            if ($stateParams.proviene)
                if ($stateParams.proviene === 'DetalleEvento')
                    vm.volver = 'home.detalleEvento({id:' +  $stateParams.evento + '})';
                else if ($stateParams.proviene === 'ModificarEvento')
                    vm.volver = 'home.modificarEvento({id:' + $stateParams.evento + '})';
                else if ($stateParams.proviene === 'DetalleInseminacion')
                    vm.volver = 'home.detalleInseminacion({fecha:"' + $stateParams.fecha + '", desde: "' + $stateParams.desde + '"})';
                else if($stateParams.proviene === 'ModificarInseminacion')
                    vm.volver = 'home.modificarInseminacion({fecha:"' + $stateParams.fecha + '", desde: "' + $stateParams.desde + '"})';
            $scope.$parent.blockSpinner();
            //vm.showSpinner = true;
            detalleBovinoService.inicializar($stateParams.id).then(function success(data) {
                vm.checkH = false;
                vm.checkM = false;
                //bovino
                vm.bovino = data;
                var fechaNacimiento = vm.bovino.fechaNacimiento.substring(0, 10).split('/');
                vm.bovino.fechaNacimiento = new Date(fechaNacimiento[2], (parseInt(fechaNacimiento[1] - 1)).toString(), fechaNacimiento[0]);
                if (vm.bovino.sexo === 0) {
                    vm.checkH = true;
                    vm.checkM = false;
                }
                else {
                    vm.checkH = false;
                    vm.checkM = true;
                }
                //seteamos a "" las variables 0
                angular.forEach(vm.bovino, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idBovino') {
                        vm.bovino[key] = '';
                    }
                });
                $scope.$parent.unBlockSpinner();
                //vm.showSpinner = false;
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }//fin inicializar


    }//fin archivo
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('eliminarBovinoService', eliminarBovinoService);

    eliminarBovinoService.$inject = ['$http', 'portalService'];

    function eliminarBovinoService($http, portalService) {
        var service = {
            inicializar: inicializar,
            bajaMuerte: bajaMuerte,
            bajaVenta : bajaVenta
        };

        return service;

        function inicializar(idBovino, codigoCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Bovino/initBaja',
                params: { idBovino: idBovino, codigoCampo: codigoCampo },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function bajaMuerte(idBovino, fechaMuerte) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Bovino/darBajaMuerte',
                params: { idBovino: idBovino, fechaMuerte: fechaMuerte },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function bajaVenta(venta) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Bovino/darBajaVenta',
                params: { venta: venta },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('eliminarBovinoController', eliminarBovinoController);

    eliminarBovinoController.$inject = ['$scope', 'eliminarBovinoService', '$stateParams', 'toastr', '$localStorage'];

    function eliminarBovinoController($scope, eliminarBovinoService, $stateParams, toastr, $localStorage) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.habilitar = false;
        vm.tiposEliminacion = [
            { id: '1', nombre: 'Venta' },
            { id: '2', nombre: 'Defunción' }
        ];
        vm.tipoEliminacionSeleccionada = "1";
        vm.eliminar = eliminar;
        vm.inicializar = inicializar();
        vm.getFecha = getFecha;
        vm.cambiarModoBaja = cambiarModoBaja;

        vm.btnVolver = "Cancelar";
        vm.nroCaravana = '';
        vm.habilitar = true;
        vm.bajaBovino = {};
        vm.fechaDeHoy = new Date();
        $('#datetimepicker7').datetimepicker();
        
        //inicializar();      

        function inicializar() {
            $scope.$parent.blockSpinner();
            eliminarBovinoService.inicializar($stateParams.id, $localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                //bovino
                vm.bovino = data;
                vm.establecimientos = data.establecimientosDestino.establecimientos;
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                vm.habilitar = true;
                vm.nroCaravana = vm.bovino.numCaravana;
                vm.formEliminarBovino.fechaMuerte.$setValidity("min", true);
                vm.formEliminarBovino.fechaMuerte.$setValidity("max", true);
                vm.formEliminarBovino.fechaMuerte.$setValidity("required", true);
                //seteamos a "" las variables 0
                angular.forEach(vm.bovino, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idBovino') {
                        vm.bovino[key] = '';
                    }
                })
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                //vm.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }

        function eliminar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            $('#modalConfirmEliminar').modal('hide');
            if (vm.tipoEliminacionSeleccionada === "2") {
                //var fecha = convertirFecha(vm.bajaBovino.fechaMuerte);
                eliminarBovinoService.bajaMuerte(vm.bovino.idBovino, vm.bajaBovino.fechaMuerte).then(function success(data) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    vm.btnVolver = "Volver";
                    toastr.success('Se dio de baja el bovino con éxito ', 'Éxito');
                }, function error(data) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
            else {
                vm.bajaBovino.monto = vm.bajaBovino.monto.toString().replace(',', '.');
                vm.bajaBovino.idBovino = vm.bovino.idBovino;
                eliminarBovinoService.bajaVenta(vm.bajaBovino).then(function success(data) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    vm.btnVolver = "Volver";
                    toastr.success('Se vendio el bovino con éxito ', 'Éxito');
                }, function error(data) {
                    $scope.$parent.unBlockSpinnerSave();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
        }

        function cambiarModoBaja() {
            if (vm.tipoEliminacionSeleccionada === '1') {
                vm.formEliminarBovino.fechaMuerte.$setValidity("min", true);
                vm.formEliminarBovino.fechaMuerte.$setValidity("max", true);
                vm.formEliminarBovino.fechaMuerte.$setValidity("required", true);
            }
            else {
                vm.formEliminarBovino.establecimientoDestino.$setValidity("required", true);
                vm.formEliminarBovino.monto.$setValidity("required", true);
                vm.formEliminarBovino.monto.$setValidity("min", true);
            }
        }

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = fecha.getMonth().toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        };        

        function getFecha() {
            vm.bajaBovino.fechaMuerte = $('#datetimepicker7')[0].value;
            var fechaMuerte = new Date(vm.bajaBovino.fechaMuerte.substring(6, 10), parseInt(vm.bajaBovino.fechaMuerte.substring(3, 5)) - 1, vm.bajaBovino.fechaMuerte.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaMuerte > fechaHoy) {
                vm.formEliminarBovino.fechaMuerte.$setValidity("max", false);
            }
            else {
                vm.formEliminarBovino.fechaMuerte.$setValidity("max", true);
            }
            if (fechaMuerte < fechaMin)
                vm.formEliminarBovino.fechaMuerte.$setValidity("min", false);
            else
                vm.formEliminarBovino.fechaMuerte.$setValidity("min", true);
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .factory('modificarBovinoService', modificarBovinoService);

    modificarBovinoService.$inject = ['$http', 'portalService'];

    function modificarBovinoService($http, portalService) {
        var service = {
            inicializar: inicializar,
            modificar: modificar,
            existeIdCaravana: existeIdCaravana
        };

        function inicializar(idBovino, idCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Bovino/initModificacion',
                params: { idBovino: idBovino, idCampo: idCampo },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function modificar(bovino) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Bovino',
                params: { value: bovino },
                headers: portalService.getHeadersServer()
            })
        }

        function existeIdCaravana(idCaravana, codigoCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Bovino/existeIdCaravana',
                params: {
                    idCaravana: idCaravana,
                    codigoCampo, codigoCampo
                },
                headers: portalService.getHeadersServer(),
                isArray: false
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarBovinoController', modificarBovinoController);

    modificarBovinoController.$inject = ['$scope', 'modificarBovinoService', 'toastr', '$stateParams', '$localStorage', 'establecimientoOrigenService', 'rodeoService', 'estadoService', 'categoriaService', 'razaService', 'alimentoService', 'registrarBovinoService', '$state'];

    function modificarBovinoController($scope, modificarBovinoService, toastr, $stateParams, $localStorage, establecimientoOrigenService, rodeoService, estadoService, categoriaService, razaService, alimentoService, registrarBovinoService, $state) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.habilitar = false;
        //funciones
        vm.modificar = modificar;
        vm.inicializar = inicializar();
        vm.cambiarSexo = cambiarSexo;
        vm.idCaravanaChange = idCaravanaChange;
        vm.getFecha = getFecha;
        vm.getPeso = getPeso;
        vm.cargarProvinciasyLocalidades = cargarProvinciasyLocalidades;
        vm.getLocalidades = getLocalidades;
        vm.agregarEstabOrigen = agregarEstabOrigen;
        vm.agregarRodeo = agregarRodeo;
        vm.agregarEstado = agregarEstado;
        vm.agregarCategoria = agregarCategoria;
        vm.agregarRaza = agregarRaza;
        vm.agregarAlimento = agregarAlimento;
        vm.changeEstados = changeEstados;
        vm.changeEstadosXEnfermo = changeEstadosXEnfermo;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.bovino = {};
        vm.fechaDeHoy = new Date();
        var categorias = [];
        var nroCaravanaOriginal = 0;
        var estados = [];
        //vm.habilitar = true;
        vm.inicializar = inicializar;
        vm.btnVolver = "Volver";
        vm.checkH = false;
        vm.checkM = false;
        vm.establecimiento = new establecimientoOrigenService();
        vm.rodeo = new rodeoService();
        vm.estado = new estadoService();
        vm.categoria = new categoriaService();
        vm.raza = new razaService();
        vm.alimento = new alimentoService();
        $('#datetimepicker4').datetimepicker();
        vm.maxCantidad = 0;
        var localidadesOriginales = [];
        vm.showCantAlimentoOptima = false;

        function inicializar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.habilitar = false;
            modificarBovinoService.inicializar($stateParams.id, $localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                vm.categorias = [];
                vm.habilitar = false;
                //combos
                for (var i = 0; i < data.estados.length; i++) {
                    if (data.estados[i].idEstado === 4 || data.estados[i].idEstado === 5)
                        data.estados.splice(i, 1);
                }
                vm.estados = data.estados;
                estados = angular.copy(data.estados);
                categorias = data.categorias;
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
                vm.alimentos = data.alimentos;
                //bovino
                vm.bovino = data.bovino;
                nroCaravanaOriginal = vm.bovino.numCaravana; vm.bovino.fechaNacimiento = vm.bovino.fechaNacimiento.substring(0, 10);
                if (vm.bovino.genero === 0) {
                    vm.checkH = true;
                    vm.checkM = false;
                    for (var i = 0; i < categorias.length; i++) {
                        if (categorias[i].genero === 0)
                            vm.categorias.push(categorias[i]);
                    }
                }
                else {
                    vm.checkH = false;
                    vm.checkM = true;
                    for (var i = 0; i < categorias.length; i++) {
                        if (categorias[i].genero === 1)
                            vm.categorias.push(categorias[i]);
                    }
                }
                //seteo combos
                vm.bovino.idRaza = data.bovino.idRaza.toString();
                vm.bovino.idCategoria = data.bovino.idCategoria.toString();
                vm.bovino.idEstado = data.bovino.idEstado.toString();
                vm.bovino.idRodeo = data.bovino.idRodeo.toString();
                vm.bovino.idAlimento = data.bovino.idAlimento.toString();
                vm.maxCantidad = ((12 * vm.bovino.peso) / 100).toFixed(2);
                vm.showCantAlimentoOptima = true;
                if (data.bovino.idEstablecimientoOrigen != 0) {
                    vm.bovino.idEstablecimientoOrigen = data.bovino.idEstablecimientoOrigen.toString();
                } else {
                    vm.bovino.idEstablecimientoOrigen = "";
                }
                vm.changeEstados();
                //seteamos a "" las variables 0
                angular.forEach(vm.bovino, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idBovino' && key !== 'idAlimento' && key !== 'cantAlimento') {
                        vm.bovino[key] = '';
                    }
                });
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                vm.habilitar = true;
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function cambiarSexo() {
            vm.categorias = [];
            if (vm.checkH === true) {
                vm.checkH = false;
                vm.checkM = true;
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 1)
                        vm.categorias.push(categorias[i]);
                }
            }
            else {
                vm.checkH = true;
                vm.checkM = false;
                for (var j = 0; j < categorias.length; j++) {
                    if (categorias[j].genero === 0)
                        vm.categorias.push(categorias[j]);
                }
            }
        };

        function getPeso() {
            vm.maxCantidad = ((12 * vm.bovino.peso) / 100).toFixed(2);
            vm.showCantAlimentoOptima = true;
        };

        function modificar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.bovino.peso = vm.bovino.peso.toString().replace(',', '.');
            vm.bovino.pesoAlNacer = vm.bovino.pesoAlNacer.toString().replace(',', '.');
            //vm.bovino.fechaNacimiento = convertirFecha(vm.bovino.fechaNacimiento);
            if (vm.bovino.pesoAlNacer === '' || vm.bovino.pesoAlNacer === undefined)
                vm.bovino.pesoAlNacer = 0;
            if (vm.bovino.idBovinoMadre === '' || vm.bovino.idBovinoMadre === undefined)
                vm.bovino.idBovinoMadre = 0;
            if (vm.bovino.idBovinoPadre === '' || vm.bovino.idBovinoPadre === undefined)
                vm.bovino.idBovinoPadre = 0;
            if (vm.bovino.idEstablecimientoOrigen === '' || vm.bovino.idEstablecimientoOrigen === undefined)
                vm.bovino.idEstablecimientoOrigen = 0;
            if (vm.checkH === true) vm.bovino.genero = 0;
            else if (vm.checkM === true) vm.bovino.genero = 1;
            vm.bovino.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            modificarBovinoService.modificar(vm.bovino).then(function success(data) {
                if (vm.bovino.pesoAlNacer === 0 || vm.bovino.pesoAlNacer === undefined)
                    vm.bovino.pesoAlNacer = '';
                if (vm.bovino.idBovinoMadre === 0 || vm.bovino.idBovinoMadre === undefined)
                    vm.bovino.idBovinoMadre = '';
                if (vm.bovino.idBovinoPadre === 0 || vm.bovino.idBovinoPadre === undefined)
                    vm.bovino.idBovinoPadre = '';
                if (vm.bovino.idEstablecimientoOrigen === 0 || vm.bovino.idEstablecimientoOrigen === undefined)
                    vm.bovino.idEstablecimientoOrigen = '';
                //vm.habilitar = false;
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                toastr.success('Se modificó el bovino con éxito ', 'Éxito');
            }, function error(data) {
                $scope.$parent.unBlockSpinnerSave();
                //vm.showSpinner = false;
                toastr.error('La operación no se pudo completar', 'Error');
            })
        };

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = fecha.getMonth().toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        };

        function idCaravanaChange() {
            if (vm.bovino.numCaravana !== nroCaravanaOriginal) {
                //vm.showSpinner = true;
                $scope.$parent.blockSpinner();
                vm.habilitar = false;
                modificarBovinoService.existeIdCaravana(vm.bovino.numCaravana, $localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                    if (data[0] === "1") {
                        vm.formModificarBovino.idCaravana.$setValidity("existeIdCaravana", false);
                    }
                    else {
                        vm.formModificarBovino.idCaravana.$setValidity("existeIdCaravana", true);
                    }
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                    vm.habilitar = true;
                }, function (error) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
            else if (vm.bovino.numCaravana === nroCaravanaOriginal) {
                vm.formModificarBovino.idCaravana.$setValidity("existeIdCaravana", true);
            }
        };

        function getFecha() {
            vm.bovino.fechaNacimiento = $('#datetimepicker4')[0].value;
            var fechaNac = new Date(vm.bovino.fechaNacimiento.substring(6, 10), parseInt(vm.bovino.fechaNacimiento.substring(3, 5)) - 1, vm.bovino.fechaNacimiento.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaNac > fechaHoy) {
                vm.formModificarBovino.fechaNac.$setValidity("max", false);
            }
            else {
                vm.formModificarBovino.fechaNac.$setValidity("max", true);
            }
            if (fechaNac < fechaMin)
                vm.formModificarBovino.fechaNac.$setValidity("min", false);
            else
                vm.formModificarBovino.fechaNac.$setValidity("min", true);
        };

        function cargarProvinciasyLocalidades() {
            $scope.$parent.blockSpinner();
            registrarBovinoService.cargarProvinciasyLocalidades({}, function (data) {
                vm.provincias = data.provincias;
                localidadesOriginales = data.localidades;
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function getLocalidades() {
            vm.localidades = Enumerable.From(localidadesOriginales).Where(function (x) {
                return x.idProvincia === parseInt(vm.establecimiento.idProvincia);
            }).ToArray();
        };

        function agregarEstabOrigen() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.establecimiento.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.establecimiento.$save(function (data) {
                toastr.success('Se agrego con éxito el establecimiento origen ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoEstablecimiento').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Establecimiento Origen ya existe')
                    toastr.warning('El establecimiento origen que intenta registrar, ya existe en este campo', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarRodeo() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.rodeo.idCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.rodeo.$save(function (data) {
                toastr.success('Se agrego con éxito el rodeo', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoRodeo').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Rodeo ya existe')
                    toastr.warning('El rodeo que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarEstado() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.estado.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.estado.$save(function (data) {
                toastr.success('Se agrego con éxito el estado ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoEstado').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Estado ya existe')
                    toastr.warning('El estado que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarCategoria() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.categoria.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.categoria.$save(function (data) {
                toastr.success('Se agrego con éxito la categoría ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoCategoria').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Categoria ya existe')
                    toastr.warning('La categoría que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarRaza() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.raza.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.raza.$save(function (data) {
                toastr.success('Se agrego con éxito el alimento ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoRaza').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Raza ya existe')
                    toastr.warning('La raza que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarAlimento() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.alimento.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.alimento.$save(function (data) {
                toastr.success('Se agrego con éxito el establecimiento origen ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoAlimento').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Alimento ya existe')
                    toastr.warning('El alimento que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function changeEstados() {
            if (vm.bovino.genero === '1' || vm.bovino.genero === 1) {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 1 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
            else if (vm.bovino.genero === '0' || vm.bovino.genero === 0) {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 0 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
        };

        function changeEstadosXEnfermo() {
            if (vm.bovino.enfermo === 1) {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].idEstado !== 1)
                        vm.estados.push(estados[i]);
                }
                vm.bovino.idEstado = '3';
            }
            else {
                vm.estados = estados;
                if (vm.bovino.idEstado === '3')
                    vm.bovino.idEstado = '';
            }
        };
    }
})();
(function () {
	angular.module('app')
		.factory('registrarBovinoService', function ($resource, portalService) {
			return $resource(portalService.getUrlServer() + 'api/Bovino/', {}, {
				inicializar: {
					method: 'GET',
					url: portalService.getUrlServer() + 'api/Bovino/inicializar/:idAmbitoEstado/:idCampo',
					params: {
						idAmbitoEstado: '@idAmbitoEstado',
						idCampo: '@idCampo'
					},
					headers: portalService.getHeadersServer(),
					isArray: false
				},
				save: {
					method: 'POST',
					headers: portalService.getHeadersServer(),
				},
				existeIdCaravana: {
					method: 'GET',
					url: portalService.getUrlServer() + 'api/Bovino/existeIdCaravana/:idCaravana/:codigoCampo',
					headers: portalService.getHeadersServer(),
					params: {
						idCaravana: '@idCaravana',
						codigoCampo: '@codigoCampo'
					},
					isArray: false
				},
				cargarProvinciasyLocalidades: {
					method: 'GET',
					url: portalService.getUrlServer() + 'api/Bovino/cargarProvinciasAndLoc',
					headers: portalService.getHeadersServer(),
					isArray: false
				}
			});
		});
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarBovinoController', registrarBovinoController);

    registrarBovinoController.$inject = ['$scope', 'registrarBovinoService', 'establecimientoOrigenService', 'rodeoService', 'estadoService', 'categoriaService', 'razaService', 'alimentoService', 'toastr', '$state', '$localStorage', '$sessionStorage'];

    function registrarBovinoController($scope, registrarBovinoService, establecimientoOrigenService, rodeoService, estadoService, categoriaService, razaService, alimentoService, toastr, $state, $localStorage, $sessionStorage) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.habilitar = false;
        //variables
        vm.razas = [];
        vm.estados = [];
        vm.categorias = [];
        vm.rodeos = [];
        vm.establecimientos = [];
        vm.alimentos = [];
        vm.bovino = {};
        vm.fechaDeHoy = new Date();
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.showMjeSuccess = false;
        vm.showMjeError = false;
        vm.mjeExiste = '';
        vm.maxCantidad = 0;
        vm.establecimiento = new establecimientoOrigenService();
        vm.rodeo = new rodeoService();
        vm.estado = new estadoService();
        vm.categoria = new categoriaService();
        vm.raza = new razaService();
        vm.alimento = new alimentoService();
        var categorias = [];
        var localidadesOriginales = [];
        var estados = [];
        $('#datetimepicker4').datetimepicker();
        vm.showCantAlimentoOptima = false;
        //funciones
        vm.registrar = registrar;
        vm.inicializar = inicializar();
        vm.idCaravanaChange = idCaravanaChange;
        vm.getFecha = getFecha;
        vm.getPeso = getPeso;
        vm.cargarProvinciasyLocalidades = cargarProvinciasyLocalidades;
        vm.getLocalidades = getLocalidades;
        vm.agregarEstabOrigen = agregarEstabOrigen;
        vm.agregarRodeo = agregarRodeo;
        vm.agregarEstado = agregarEstado;
        vm.agregarCategoria = agregarCategoria;
        vm.agregarRaza = agregarRaza;
        vm.agregarAlimento = agregarAlimento;
        vm.changeEstados = changeEstados;
        vm.changeCategorias = changeCategorias;
        vm.changeEstadosXEnfermo = changeEstadosXEnfermo;

        function inicializar() {
            //$scope.$parent.blockSpinner();
            vm.habilitar = false;
            registrarBovinoService.inicializar({ idAmbitoEstado: '1', idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                for (var i = 0; i < data.estados.length; i++) {
                    if (data.estados[i].idEstado === 4 || data.estados[i].idEstado === 5)
                        data.estados.splice(i, 1);
                }
                vm.estados = data.estados;
                estados = angular.copy(data.estados);
                vm.categorias = data.categorias;
                categorias = angular.copy(data.categorias);
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.establecimientos = data.establecimientos;
                vm.alimentos = data.alimentos;
                $scope.$parent.unBlockSpinner();
                //vm.showSpinner = false;
                vm.habilitar = true;
                vm.bovino = new registrarBovinoService();
                vm.bovino.genero = 0;
                vm.rodeo.confinado = 0;
                vm.changeCategorias();
                changeEstados();
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function registrar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.bovino.peso = vm.bovino.peso.toString().replace(',', '.');
            if (vm.bovino.pesoAlNacer !== undefined && vm.bovino.pesoAlNacer !== '')
                vm.bovino.pesoAlNacer = vm.bovino.pesoAlNacer.toString().replace(',', '.');
            //vm.bovino.fechaNacimiento = convertirFecha(vm.bovino.fechaNacimiento);
            vm.bovino.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.bovino.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.bovino.$save(function (data) {
                toastr.success('Se agrego con éxito el bovino ', 'Éxito');
                //vm.habilitar = false;
                vm.btnVolver = "Volver";
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = false;
                if (error.statusText === 'Bovino ya existe') {
                    toastr.warning('Ya existe un bovino con ese número de caravana', 'Advertencia');
                    var fecha = vm.bovino.fechaNacimiento.split('/');
                    vm.bovino.fechaNacimiento = new Date(fecha[2], fecha[1], fecha[0]);
                }
                else {
                    toastr.error('La operación no se pudo completar', 'Error');
                }
            });
        };

        function idCaravanaChange() {
            if (vm.bovino.numCaravana) {
                $scope.$parent.blockSpinner();
                //vm.showSpinner = true;
                vm.habilitar = false;
                registrarBovinoService.existeIdCaravana({ idCaravana: vm.bovino.numCaravana, codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                    if (data[0] === "1") {
                        vm.formRegistrarBovino.idCaravana.$setValidity("existeIdCaravana", false);
                    }
                    else {
                        vm.formRegistrarBovino.idCaravana.$setValidity("existeIdCaravana", true);
                    }
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                    vm.habilitar = true;
                }, function (error) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
        };

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = fecha.getMonth().toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        };

        function getPeso() {
            vm.maxCantidad = ((12 * vm.bovino.peso) / 100).toFixed(2);
            vm.showCantAlimentoOptima = true;
        };

        function getFecha() {
            vm.bovino.fechaNacimiento = $('#datetimepicker4')[0].value;
            var fechaNac = new Date(vm.bovino.fechaNacimiento.substring(6, 10), parseInt(vm.bovino.fechaNacimiento.substring(3, 5)) - 1, vm.bovino.fechaNacimiento.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaNac > fechaHoy) {
                vm.formRegistrarBovino.fechaNac.$setValidity("max", false);
            }
            else {
                vm.formRegistrarBovino.fechaNac.$setValidity("max", true);
            }
            if (fechaNac < fechaMin)
                vm.formRegistrarBovino.fechaNac.$setValidity("min", false);
            else
                vm.formRegistrarBovino.fechaNac.$setValidity("min", true);
        };

        function cargarProvinciasyLocalidades() {
            $scope.$parent.blockSpinner();
            registrarBovinoService.cargarProvinciasyLocalidades({}, function (data) {
                vm.provincias = data.provincias;
                localidadesOriginales = data.localidades;
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function getLocalidades() {
            vm.localidades = Enumerable.From(localidadesOriginales).Where(function (x) {
                return x.idProvincia === parseInt(vm.establecimiento.idProvincia);
            }).ToArray();
        };

        function agregarEstabOrigen() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.establecimiento.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.establecimiento.$save(function (data) {
                toastr.success('Se agrego con éxito el establecimiento origen ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoEstablecimiento').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Establecimiento Origen ya existe')
                    toastr.warning('El establecimiento origen que intenta registrar, ya existe en este campo', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarRodeo() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.rodeo.idCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.rodeo.$save(function (data) {
                toastr.success('Se agrego con éxito el rodeo', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoRodeo').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Rodeo ya existe')
                    toastr.warning('El rodeo que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarEstado() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.estado.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.estado.$save(function (data) {
                toastr.success('Se agrego con éxito el estado ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoEstado').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Estado ya existe')
                    toastr.warning('El estado que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarCategoria() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.categoria.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.categoria.$save(function (data) {
                toastr.success('Se agrego con éxito la categoría ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoCategoria').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Categoria ya existe')
                    toastr.warning('La categoría que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarRaza() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.raza.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.raza.$save(function (data) {
                toastr.success('Se agrego con éxito la raza ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoRaza').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Raza ya existe')
                    toastr.warning('La raza que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarAlimento() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            vm.alimento.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.alimento.$save(function (data) {
                toastr.success('Se agrego con éxito el alimento ', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoAlimento').modal('hide');
                $state.reload();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                if (error.statusText === 'Alimento ya existe')
                    toastr.warning('El alimento que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function changeEstados() {
            if (vm.bovino.genero === '1' || vm.bovino.genero === 1) {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 1 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
            else if (vm.bovino.genero === '0' || vm.bovino.genero === 0) {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].genero === 0 || estados[i].genero === 2)
                        vm.estados.push(estados[i]);
                }
            }
        };

        function changeEstadosXEnfermo() {
            if (vm.bovino.enfermo === 1) {
                vm.estados = [];
                for (var i = 0; i < estados.length; i++) {
                    if (estados[i].idEstado !== 1)
                        vm.estados.push(estados[i]);
                }
                vm.bovino.idEstado = '3';
            }
            else {
                vm.estados = estados;
                if (vm.bovino.idEstado === '3')
                    vm.bovino.idEstado = '';
            }
        };

        function changeCategorias() {
            if (vm.bovino.genero === '1') {
                vm.categorias = [];
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 1)
                        vm.categorias.push(categorias[i]);
                }
            }
            else if (vm.bovino.genero === '0' || vm.bovino.genero === 0) {
                vm.categorias = [];
                for (var i = 0; i < categorias.length; i++) {
                    if (categorias[i].genero === 0)
                        vm.categorias.push(categorias[i]);
                }
            }
        };
    }
})();
(function () {
    angular.module('app')
        .factory('registrarCampoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Campo/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Bovino/cargarProvinciasAndLoc',
                    headers: portalService.getHeadersServer(),
                    isArray: false
                },
                save: {
                    method: 'POST',
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("campo", angular.toJson(data));
                        if (data.imagen) {
                            formData.append("file" + 0, data.imagen);
                        }
                        return formData;
                    },
                    headers: portalService.getContentUndefined()
                },
                validarCantCamposUsuario: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Campo/validarCantCamposXUsuario',
                    params: {
                        usuario: '@usuario'
                    },
                    headers: portalService.getHeadersServer(),
                    isArray: false
                }
            });
        });
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarCampoController', registrarCampoController);

    registrarCampoController.$inject = ['$scope', 'registrarCampoService', '$localStorage', 'toastr', '$sessionStorage', '$state'];

    function registrarCampoController($scope, registrarCampoService, $localStorage, toastr, $sessionStorage, $state) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.campo = {};
        var localidadesOriginales = [];
        vm.imageToUpload = [];
        vm.toDelete = [];
        //metodos
        vm.inicializar = inicializar();
        vm.registrar = registrar;
        vm.getLocalidades = getLocalidades;
        vm.selectUnselectImage = selectUnselectImage;
        vm.ImageClass = ImageClass;
        vm.deleteImagefromModel = deleteImagefromModel;
        vm.UploadImg = UploadImg;

        function inicializar() {
            vm.campo = new registrarCampoService();
            //vm.showSpinner = false;
            $scope.$parent.blockSpinner();
            registrarCampoService.inicializar({}, function (data) {
                vm.provincias = data.provincias;
                localidadesOriginales = data.localidades;
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function registrar() {
            vm.habilitar = false;
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            vm.campo.usuario = $sessionStorage.usuarioInfo.usuario;
            if (vm.imageToUpload[0])
                vm.campo.imagen = vm.imageToUpload[0];
            vm.campo.$save(function success(data) {
                toastr.success('Se agrego con éxito el campo', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $state.go('seleccionCampo');
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = true;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function getLocalidades() {
            vm.localidades = Enumerable.From(localidadesOriginales).Where(function (x) {
                return x.idProvincia === parseInt(vm.campo.idProvincia);
            }).ToArray();
        };

        function selectUnselectImage(item) {
            var index = vm.toDelete.indexOf(item);
            if (index != -1) {
                vm.toDelete.splice(index, 1);
            } else {
                $scope.toDelete.push(item)
            }
        };

        function ImageClass(item) {
            var index = vm.toDelete.indexOf(item);
            if (index != -1) {
                return true;
            } else {
                return false;
            }
        };

        function deleteImagefromModel() {
            if (vm.toDelete != [] && vm.toDelete.length > 0) {
                angular.forEach($scope.toDelete, function (value, key) {
                    var index = vm.imageToUpload.indexOf(value);
                    var indexToDelete = vm.toDelete.indexOf(value);
                    if (index != -1) {
                        vm.imageToUpload.splice(index, 1);
                        vm.toDelete.splice(indexToDelete, 1);
                    }
                });
            }
            else {
                toastr.info('Debe seleccionar una imágen para borrar', 'Aviso');
            }
        };

        function UploadImg($files, $invalidFiles) {
            $scope.imageToUpload = $files
        };
    }
})();

(function () {
    angular.module('app')
        .factory('configuracionService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Usuario/', {}, {
                actualizarPerfilUsuario: {
                    method: 'PUT',
                    url: portalService.getUrlServer() + 'api/Usuario/UpdatePerfil',
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("usuario", angular.toJson(data));
                        if (data.imagen) {
                            formData.append("file" + 0, data.imagen);
                        }
                        return formData;
                    },
                    headers: portalService.getContentUndefined()
                },
                getDatosPerfilUsuario: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Usuario/GetDatosPerfil',
                    params: {
                        usuario: '@usuario',
                        campo: '@campo',
                        idRol: '@idRol'
                    },
                    headers: portalService.getHeadersServer(),
                    isArray: false
                }
            });
        });
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('configuracionController', configuracionController);

    configuracionController.$inject = ['$scope', 'configuracionService', 'toastr', '$localStorage', '$sessionStorage', 'razaService', '$timeout', 'alimentoService', 'rodeoService', 'estadoService', 'categoriaService', 'establecimientoOrigenService', 'antibioticoService', 'vacunaService', 'registrarBovinoService', 'portalService', '$state'];

    function configuracionController($scope, configuracionService, toastr, $localStorage, $sessionStorage, razaService, $timeout, alimentoService, rodeoService, estadoService, categoriaService, establecimientoOrigenService, antibioticoService, vacunaService, registrarBovinoService, portalService, $state) {
        window.scrollTo(0, 0);
        $scope.itemsPorPagina = 5;
        $scope.nuevaRaza = false;
        $scope.nuevoAlimento = false;
        $scope.nuevoRodeo = false;
        $scope.nuevoEstado = false;
        $scope.nuevaCategoria = false;
        $scope.nuevoEstab = false;
        $scope.nuevoAntibiotico = false;
        $scope.nuevaVacuna = false;
        $scope.showBorrar = false;
        $scope.toDelete = [];
        var localidadesOriginales = [];
        $scope.inicializar = inicializar();
        $scope.popupRazas = popupRazas;
        $scope.popupAlimentos = popupAlimentos;
        $scope.popupRodeos = popupRodeos;
        $scope.popupEstados = popupEstados;
        $scope.popupCategorias = popupCategorias;
        $scope.popupEstablecimientos = popupEstablecimientos;
        $scope.popupAntibioticos = popupAntibioticos;
        $scope.popupVacunas = popupVacunas;
        $scope.cargarProvinciasyLocalidades = cargarProvinciasyLocalidades;
        $scope.getLocalidades = getLocalidades;
        $scope.agregarEstabOrigen = agregarEstabOrigen;
        $scope.agregarRodeo = agregarRodeo;
        $scope.agregarEstado = agregarEstado;
        $scope.agregarRaza = agregarRaza;
        $scope.agregarAlimento = agregarAlimento;
        $scope.agregarAntibiotico = agregarAntibiotico;
        $scope.agregarVacuna = agregarVacuna;
        $scope.agregarCategoria = agregarCategoria;
        $scope.popupPerfil = popupPerfil;
        $scope.modificarPerfil = modificarPerfil;
        $scope.UploadImg = UploadImg;
        $scope.ImageClass = ImageClass;
        $scope.selectUnselectImage = selectUnselectImage;
        $scope.deleteImagefromModel = deleteImagefromModel;

        function inicializar() {
            //$scope.showSpinner = true;
            $scope.$parent.blockSpinner();
            cargarProvinciasyLocalidades();
        }

        function popupAlimentos() {
            $scope.$parent.blockSpinner();
            $scope.nuevoAlimento = false;
            $scope.itemsPorPagina = 5;
            $scope.alimento = new alimentoService();
            alimentoService.get({ idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.alimentosCollection = data;
                $scope.$parent.unBlockSpinner();
                $('#modalNuevoAlimento').modal('show');
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error')
            });
        };

        function popupAntibioticos() {
            $scope.$parent.blockSpinner();
            $scope.nuevoAntibiotico = false;
            $scope.itemsPorPagina = 5;
            $scope.antibiotico = new antibioticoService();
            antibioticoService.get({ idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.antibioticosCollection = data;
                $scope.$parent.unBlockSpinner();
                $('#modalNuevoAntibiotico').modal('show');
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar')
            });
        };

        function popupEstados() {
            $scope.$parent.blockSpinner();
            $scope.nuevoEstado = false;
            $scope.itemsPorPagina = 5;
            $scope.estado = new estadoService();
            estadoService.get({ codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.estadosCollection = data;
                $scope.$parent.unBlockSpinner();
                $('#modalNuevoEstado').modal('show');
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function popupEstablecimientos() {
            $scope.$parent.blockSpinner();
            $scope.nuevoEstab = false;
            $scope.itemsPorPagina = 5;
            $scope.establecimiento = new establecimientoOrigenService();
            establecimientoOrigenService.get({ codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.establecimientosCollection = data;
                $scope.$parent.unBlockSpinner();
                $('#modalNuevoEstablecimiento').modal('show');
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function popupCategorias() {
            $scope.$parent.blockSpinner();
            $scope.nuevaCategoria = false;
            $scope.itemsPorPagina = 5;
            $scope.categoria = new categoriaService();
            categoriaService.get({ codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.categoriasCollection = data;
                $scope.$parent.unBlockSpinner();
                $('#modalNuevaCategoria').modal('show');
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function popupRazas() {
            $scope.$parent.blockSpinner();
            $scope.nuevaRaza = false;
            $scope.itemsPorPagina = 5;
            $scope.raza = new razaService();
            razaService.get({ codigoCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.razasCollection = data;
                $scope.$parent.unBlockSpinner();
                $('#modalNuevaRaza').modal('show');
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function popupRodeos() {
            $scope.$parent.blockSpinner();
            $scope.nuevoRodeo = false;
            $scope.itemsPorPagina = 5;
            $scope.rodeo = new rodeoService();
            rodeoService.get({ campo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.rodeosCollection = data;
                $scope.$parent.unBlockSpinner();
                $('#modalNuevoRodeo').modal('show');
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function popupVacunas() {
            $scope.$parent.blockSpinner();
            $scope.nuevaVacuna = false;
            $scope.itemsPorPagina = 5;
            $scope.vacuna = new vacunaService();
            vacunaService.get({ idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                $scope.vacunasCollection = data;
                $scope.$parent.unBlockSpinner();
                $('#modalNuevaVacuna').modal('show');
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function popupPerfil() {
            $scope.imageToUpload = [];
            $scope.toDelete = [];
            //$scope.showBorrar = false;
            $scope.$parent.blockSpinner();
            configuracionService.getDatosPerfilUsuario({ campo: $localStorage.usuarioInfo.codigoCampo, usuario: $sessionStorage.usuarioInfo.usuario, idRol: $sessionStorage.usuarioInfo.idRol }, function (data) {
                $scope.perfilUsuario = data;
                $scope.perfilUsuario.usuarioImagen = portalService.getUrlServer() + portalService.getFolderImagenUsuario() + '\\' + $scope.perfilUsuario.usuarioImagen + "?cache=" + (new Date()).getTime();
                $scope.$parent.unBlockSpinner();
                $('#modalPerfilUser').modal('show');
            }, function (error) {
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function cargarProvinciasyLocalidades() {
            registrarBovinoService.cargarProvinciasyLocalidades({}, function (data) {
                $scope.provincias = data.provincias;
                localidadesOriginales = data.localidades;
                $scope.$parent.unBlockSpinner();
                //$scope.showSpinner = false;
            }, function error(error) {
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function getLocalidades() {
            $scope.localidades = Enumerable.From(localidadesOriginales).Where(function (x) {
                return x.idProvincia === parseInt($scope.establecimiento.idProvincia);
            }).ToArray();
        };

        function agregarEstabOrigen() {
            //$scope.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            $scope.establecimiento.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.establecimiento.$save(function (data) {
                toastr.success('Se agrego con éxito el establecimiento origen ', 'Éxito');
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoEstablecimiento').modal('hide');
                $state.reload();
            }, function (error) {
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                if (error.statusText === 'Establecimiento Origen ya existe')
                    toastr.warning('El establecimiento origen que intenta registrar, ya existe en este campo', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarRodeo() {
            //$scope.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            $scope.rodeo.idCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.rodeo.$save(function (data) {
                toastr.success('Se agrego con éxito el rodeo', 'Éxito');
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoRodeo').modal('hide');
                $state.reload();
            }, function (error) {
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                if (error.statusText === 'Rodeo ya existe')
                    toastr.warning('El rodeo que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarEstado() {
            //$scope.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            $scope.estado.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.estado.$save(function (data) {
                toastr.success('Se agrego con éxito el estado ', 'Éxito');
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoEstado').modal('hide');
                $state.reload();
            }, function (error) {
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                if (error.statusText === 'Estado ya existe')
                    toastr.warning('El estado que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarCategoria() {
            //$scope.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            $scope.categoria.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.categoria.$save(function (data) {
                toastr.success('Se agrego con éxito la categoría ', 'Éxito');
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevaCategoria').modal('hide');
                $state.reload();
            }, function (error) {
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                if (error.statusText === 'Categoria ya existe')
                    toastr.warning('La categoría que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarRaza() {
            //$scope.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            $scope.raza.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.raza.$save(function (data) {
                toastr.success('Se agrego con éxito la raza ', 'Éxito');
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevaRaza').modal('hide');
                $state.reload();
            }, function (error) {
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                if (error.statusText === 'Raza ya existe')
                    toastr.warning('La raza que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarAlimento() {
            //$scope.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            $scope.alimento.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.alimento.$save(function (data) {
                toastr.success('Se agrego con éxito el alimento ', 'Éxito');
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoAlimento').modal('hide');
                $state.reload();
            }, function (error) {
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                if (error.statusText === 'Alimento ya existe')
                    toastr.warning('El alimento que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarAntibiotico() {
            //$scope.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            $scope.antibiotico.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.antibiotico.$save(function (data) {
                toastr.success('Se agrego con éxito el antibiótico ', 'Éxito');
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevoAntibiotico').modal('hide');
                $state.reload();
            }, function (error) {
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                if (error.statusText === 'Antibiotico ya existe')
                    toastr.warning('El antibiótico que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function agregarVacuna() {
            //$scope.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            $scope.vacuna.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            $scope.vacuna.$save(function (data) {
                toastr.success('Se agrego con éxito el vacuna ', 'Éxito');
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $('#modalNuevaVacuna').modal('hide');
                $state.reload();
            }, function (error) {
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                if (error.statusText === 'Vacuna ya existe')
                    toastr.warning('La vacuna que intenta registrar, ya existe', 'Advertencia');
                else
                    toastr.error('La operación no se pudo completar', 'Error');
            });
        };

        function modificarPerfil() {           
            $scope.$parent.blockSpinnerSave();
            if ($scope.imageToUpload[0])
                $scope.perfilUsuario.imagen = $scope.imageToUpload[0];
            $scope.perfilUsuario.usuario = $sessionStorage.usuarioInfo.usuario;
            $scope.perfilUsuario.$actualizarPerfilUsuario(function(data) {
                toastr.success('Datos del perfil actualizados', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                $('#modalPerfilUser').modal('hide');
                //$state.reload();
            }, function (error) {
                //$scope.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function UploadImg($files, $invalidFiles) {
            $scope.imageToUpload = $files;
            if ($scope.perfilUsuario.usuarioImagen) {
                $scope.perfilUsuario.usuarioImagen = undefined;
            }
        };

        function selectUnselectImage(item) {
            if (!$scope.showBorrar) {
                $scope.toDelete = [];
                $scope.showBorrar = true;
                var index = $scope.toDelete.indexOf(item);
                if (index != -1) {
                    $scope.toDelete.splice(index, 1);
                } else {
                    $scope.toDelete.push(item)
                }
            }
            else {
                $scope.toDelete = [];
                $scope.showBorrar = false;
            }
        };

        function ImageClass(item) {
            var index = $scope.toDelete.indexOf(item);
            if (index != -1) {
                return true;
            } else {
                return false;
            }
        };

        function deleteImagefromModel() {
            if ($scope.toDelete != [] && $scope.toDelete.length > 0) {
                angular.forEach($scope.toDelete, function (value, key) {
                    var index = $scope.imageToUpload.indexOf(value);
                    var indexToDelete = $scope.toDelete.indexOf(value);
                    if (index != -1) {
                        $scope.imageToUpload.splice(index, 1);
                        $scope.toDelete.splice(indexToDelete, 1);
                        $scope.showBorrar = false;
                    }
                });
            }
            else {
                toastr.info('Debe seleccionar una imágen para borrar', 'Aviso');
            }
        };
    }//fin controlador
})();

(function () {
    angular.module('app')
        .factory('consultarConflictoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Inconsistencia', {}, {
                obtenerConflictos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Inconsistencia/GetList',
                    headers: portalService.getHeadersServer(),
                    isArray: true
                }
            });
        });
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarConflictoController', consultarConflictoController);

    consultarConflictoController.$inject = ['$scope', 'consultarConflictoService', 'toastr', '$localStorage', '$state', 'exportador', '$stateParams'];

    function consultarConflictoController($scope, consultarConflictoService, toastr, $localStorage, $state, exportador, $stateParams) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.fechaDeHoy = new Date();
        $('#datetimepicker4').datetimepicker();
        $('#datetimepicker5').datetimepicker();

        vm.init = init();
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.getFechaDesde = getFechaDesde;
        vm.getFechaHasta = getFechaHasta;
        vm.exportarExcel = exportarExcel;
        vm.exportarPDF = exportarPDF;

        function init() {
            if ($localStorage.proviene) {
                $localStorage.proviene = null;
                $state.reload();
            }                
            vm.itemsPorPagina = 9;
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.filtro = {};
            vm.filtro.tipo = '0';
            vm.filtro.estado = '2';
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            consultar();
        };

        function consultar() {
            $scope.$parent.blockSpinner();
            if (vm.filtro.fechaDesde) {
                if (typeof vm.filtro.fechaDesde === "string")
                    vm.filtro.fechaDesde = new Date(vm.filtro.fechaDesde.split('/')[2], (parseInt(vm.filtro.fechaDesde.split('/')[1]) - 1).toString(), vm.filtro.fechaDesde.split('/')[0]);
                vm.filtro.fechaDesde = convertirFecha(vm.filtro.fechaDesde);
            }
            if (vm.filtro.fechaHasta) {
                if (typeof vm.filtro.fechaHasta === "string")
                    vm.filtro.fechaHasta = new Date(vm.filtro.fechaHasta.split('/')[2], (parseInt(vm.filtro.fechaHasta.split('/')[1]) - 1).toString(), vm.filtro.fechaHasta.split('/')[0]);
                vm.filtro.fechaHasta = convertirFecha(vm.filtro.fechaHasta);
            }
            consultarConflictoService.obtenerConflictos({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (data.length === 0) {
                    vm.disabledExportar = 'disabled';
                    //vm.showSpinner = false;
                    vm.disabled = '';
                    vm.rowCollection = [];
                    toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                else {
                    vm.rowCollection = data;
                    //vm.showSpinner = false;
                    vm.disabled = '';
                    vm.disabledExportar = '';
                }
                $scope.$parent.unBlockSpinner();
            }, function (error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function limpiarCampos() {
            $state.reload();
        };

        function exportarExcel() {
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Tipo de Conflicto';
            filtro.Titulos[1] = 'Estado';
            filtro.Titulos[2] = 'Fecha Desde';
            filtro.Titulos[3] = 'Fecha Hasta';

            var titulos = [];
            titulos[0] = "Tipo de Conflicto";
            titulos[1] = "Fecha";
            titulos[2] = "Estado";

            var propiedades = [];
            propiedades[0] = "tipo";
            propiedades[1] = "fecha";
            propiedades[2] = "estado";

            if (vm.rowCollection.length > 0) {
                var i = 0;
                for (var property in vm.filtro) {
                    var type = typeof vm.filtro[property];
                    if ((vm.filtro[property] === null || type !== "object") && property !== "$resolved" && type !== "function" && property !== "codigoCampo") {
                        if (property === "tipo") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else if (vm.filtro[property] === '1') {
                                filtro[i] = 'Evento';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Inseminación';
                                i += 1;
                            }
                        }
                        else if (property === "estado") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else if (vm.filtro[property] === '1') {
                                filtro[i] = 'Solucionado';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Pendiente';
                                i += 1;
                            }
                        }
                        else {
                            filtro[i] = $scope.filtro[property];
                            i += 1;
                        }
                    }
                }
                if (vm.filtro.fechaDesde === undefined)
                    filtro[filtro.length] = '';
                if (vm.filtro.fechaHasta === undefined)
                    filtro[filtro.length] = '';
                var fecha = new Date();
                fecha = convertirFecha(fecha);
                exportador.exportarExcel('Conflictos' + fecha, vm.rowCollection, titulos, filtro, propiedades, 'Conflictos', function () {
                    toastr.success("Se ha exportado con Éxito", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        };

        function exportarPDF() {
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Tipo de Conflicto';
            filtro.Titulos[1] = 'Estado';
            filtro.Titulos[2] = 'Fecha Desde';
            filtro.Titulos[3] = 'Fecha Hasta';

            var propiedades = [];
            propiedades[0] = "tipo";
            propiedades[1] = "fecha";
            propiedades[2] = "estado";

            if (vm.rowCollection.length > 0) {
                var i = 0;
                for (var property in vm.filtro) {
                    var type = typeof vm.filtro[property];
                    if ((vm.filtro[property] === null || type !== "object") && property !== "$resolved" && type !== "function" && property !== "codigoCampo") {
                        if (property === "tipo") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else if (vm.filtro[property] === '1') {
                                filtro[i] = 'Evento';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Inseminación';
                                i += 1;
                            }
                        }
                        else if (property === "estado") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else if (vm.filtro[property] === '1') {
                                filtro[i] = 'Solucionado';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Pendiente';
                                i += 1;
                            }
                        }
                        else {
                            filtro[i] = $scope.filtro[property];
                            i += 1;
                        }
                    }
                }
                if (vm.filtro.fechaDesde === undefined)
                    filtro[filtro.length] = '';
                if (vm.filtro.fechaHasta === undefined)
                    filtro[filtro.length] = '';
                if (vm.filtro.peso === undefined)
                    filtro[filtro.length] = '';
                var fecha = new Date();
                fecha = convertirFecha(fecha);

                var tab_text = '<html><head></head><body>';
                tab_text += "<h1 style='align:center;'>Conflictos</h1>";
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
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Tipo de Conflicto</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Estado</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Fecha</font></b></td>";
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

                exportador.exportarPDF('Conflictos' + fecha, tab_text, function () {
                    toastr.success("Se ha exportado con Éxito.", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        };

        function convertirFecha(fecha) {
            var dia, mes, año, hora, min;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = (fecha.getMonth() + 1).toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        };

        function getFechaDesde() {
            vm.filtro.fechaDesde = $('#datetimepicker4')[0].value;
            var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
            var fechaMin = new Date(2000, 1, 1);
            if (fechaDesde < fechaMin) {
                vm.formConsultarConflicto.fechaDesde.$setValidity("min", false);
            }
            else {
                vm.formConsultarConflicto.fechaDesde.$setValidity("min", true);
            }
        };

        function getFechaHasta() {
            vm.filtro.fechaHasta = $('#datetimepicker5')[0].value;
            if (vm.filtro.fechaDesde !== undefined) {
                var fechaHasta = new Date(vm.filtro.fechaHasta.substring(6, 10), parseInt(vm.filtro.fechaHasta.substring(3, 5)) - 1, vm.filtro.fechaHasta.substring(0, 2));
                var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
                if (fechaHasta < fechaDesde) {
                    vm.formConsultarConflicto.fechaHasta.$setValidity("min", false);
                }
                else {
                    vm.formConsultarConflicto.fechaHasta.$setValidity("min", true);
                }
            }
        };
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .factory('resolverConflictoService', resolverConflictoService);

    resolverConflictoService.$inject = ['$http', 'portalService'];

    function resolverConflictoService($http, portalService) {
        var service = {
            getDatos: getDatos,
            resolver: resolver
        };

        function getDatos(idTac, fechaTac, idTacC, fechaTacC, idIns, idInsC) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inconsistencia/Get',
                params: {
                    idTacto: idTac,
                    fechaTacto: fechaTac,
                    idTactoConflictivo: idTacC,
                    fechaTactoConflictivo: fechaTacC,
                    idInseminacion: idIns,
                    idInseminacionConflictiva: idInsC
                },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function resolver(resolucion) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Inconsistencia/Post',
                params: { value: resolucion },
                headers: portalService.getHeadersServer()
            })
        }

        function initModificacion(id, usuario, codigoCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/initEvento',
                params: {
                    idEvento: id,
                    usuario: usuario,
                    idCampo: codigoCampo
                },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        

        function getRodeos(campo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Rodeo/GetList',
                params: {
                    campo: campo
                },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('resolverConflictoController', resolverConflictoController);

    resolverConflictoController.$inject = ['$scope', '$stateParams', 'resolverConflictoService', 'toastr', '$state', '$localStorage'];

    function resolverConflictoController($scope, $stateParams, resolverConflictoService, toastr, $state, $localStorage) {
        var vm = $scope;
        window.scrollTo(0, 0);
        /////VARIABLES
        vm.inseminacionResultante = {};
        vm.tactoResultante = {};

        /////METODOS
        vm.init = init();
        vm.seleccionarInseminacion = seleccionarInseminacion;
        vm.seleccionarTacto = seleccionarTacto;
        vm.seleccionarPropiedadInseminacion = seleccionarPropiedadInseminacion;
        vm.seleccionarPropiedadTacto = seleccionarPropiedadTacto;
        vm.resolverInseminacion = resolverInseminacion;
        vm.resolverTacto = resolverTacto;
        vm.isUndefinedOrNull = isUndefinedOrNull;
        vm.seleccionarToros = seleccionarToros;

        function init() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            if (($stateParams.idTacto && $stateParams.idTactoConfl && $stateParams.fechaTacto && $stateParams.fechaTactoConfl) || ($stateParams.idInseminacion && $stateParams.idInseminConfl)) {
                if (!$stateParams.idTacto)
                    $stateParams.idTacto = 0;
                if (!$stateParams.idTactoConfl)
                    $stateParams.idTactoConfl = 0;
                if (!$stateParams.idInseminacion)
                    $stateParams.idInseminacion = 0;
                if (!$stateParams.idInseminConfl)
                    $stateParams.idInseminConfl = 0;
                if (!$stateParams.fechaTacto)
                    $stateParams.fechaTacto = '';
                if (!$stateParams.fechaTactoConfl)
                    $stateParams.fechaTactoConfl = '';
                resolverConflictoService.getDatos($stateParams.idTacto, $stateParams.fechaTacto, $stateParams.idTactoConfl, $stateParams.fechaTactoConfl, $stateParams.idInseminacion, $stateParams.idInseminConfl).then(function success(data) {
                    vm.tactoAnterior = data.tactoAnterior; //Es el ultimo tacto registrado en base
                    vm.tactoNuevo = data.tactoNuevo; //Es el tacto que se intento registrar en base, pero produjo un conflicto
                    vm.inseminacionAnterior = data.inseminacionAnterior; //Es la ultima inseminacion registrada en base
                    vm.inseminacionNueva = data.inseminacionNueva; //Es la inseminacion que se intento registrar pero produjo un conflicto
                    $scope.$parent.unBlockSpinner();
                    //vm.showSpinner = false;
                }, function error(error) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
            else {
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
                $scope.$parent.unBlockSpinner();
                //vm.showSpinner = false;
            }
        }

        function seleccionarInseminacion(inseminacion) {
            vm.inseminacionResultante.fechaInseminacion = inseminacion.fechaInseminacion;
            vm.inseminacionResultante.tipoInseminacion = inseminacion.tipoInseminacion;
            vm.inseminacionResultante.idTipoInseminacion = inseminacion.idTipoInseminacion;
        }

        function seleccionarToros(toros) {
            vm.inseminacionResultante.listaBovinos = toros;
        }

        function seleccionarTacto(tacto) {
            vm.tactoResultante.fechaTacto = tacto.fechaTacto;
            vm.tactoResultante.tipoTacto = tacto.tipoTacto;
            vm.tactoResultante.idTipoTacto = tacto.idTipoTacto;
            vm.tactoResultante.exitoso = tacto.exitoso;
        }

        function seleccionarPropiedadInseminacion(inseminacion, propiedad) {
            vm.inseminacionResultante[propiedad] = inseminacion[propiedad];
            vm.inseminacionResultante.idTipoInseminacion = inseminacion.idTipoInseminacion;
        }

        function seleccionarPropiedadTacto(tacto, propiedad) {
            vm.tactoResultante[propiedad] = tacto[propiedad];
            vm.tactoResultante.idTipoTacto = tacto.idTipoTacto;
        }
        

        function resolverInseminacion() {
            $scope.$parent.blockSpinnerSave();
            var obj = { inseminacionAnterior: vm.inseminacionAnterior, inseminacionNueva: vm.inseminacionNueva, inseminacionResultante: vm.inseminacionResultante };
            resolverConflictoService.resolver(obj).then(function success(data) {
                $scope.$parent.unBlockSpinnerSave();
                $('#modalConfirmResolverInseminacionConflictiva').modal('hide');
                toastr.success('Conflicto resuelto con éxito');
                $localStorage.proviene = 'resolver';
                $state.go('home.conflictos');
            }, function error(error) {
                $scope.$parent.unBlockSpinnerSave();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function resolverTacto() {
            $scope.$parent.blockSpinnerSave();
            var obj = { tactoAnterior: vm.tactoAnterior, tactoNuevo: vm.tactoNuevo, tactoResultante: vm.tactoResultante };
            resolverConflictoService.resolver(obj).then(function success(data) {
                $scope.$parent.unBlockSpinnerSave();
                $('#modalConfirmResolverTactoConflictivo').modal('hide');
                toastr.success('Conflicto resuelto con éxito');
                $localStorage.proviene = 'resolver';
                $state.go('home.conflictos');
            }, function error(error) {
                $scope.$parent.unBlockSpinnerSave();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function isUndefinedOrNull(val) {
            return angular.isUndefined(val) || val === null
        }
    }
})();

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
            var largo = 0;
            if (filter !== null && titulos.length > filter.Titulos.length)
                largo = titulos.length;
            else if (filter !== null)
                largo = filter.Titulos.length;
            else
                largo = titulos.length;
            tab_text += "<tr><td style='text-align:center; font-size:20px' colspan='" + largo + "'><b>" + tituloReporte + "</b></td></tr>" + "<tr></tr>";
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
(function () {
    'use strict';

    angular
        .module('app')
        .factory('homeService', homeService);

    homeService.$inject = ['$http', 'portalService'];

    function homeService($http, portalService) {
        var service = {
            datosUsuario: datosUsuario
        };

        function datosUsuario(usuario, codigoCampo, idRol) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Home/GetDatosUserLogueado',
                params: { usuario: usuario, codigoCampo: codigoCampo, idRol: idRol },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();




/*(function () {
    'use strict';
    angular.module('app')
        .factory('homeService', function ($resource, portalService) {
        return $resource(portalService.getUrlServer() + 'api/Home/', {}, {
            datosUsuario: {
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Home/GetDatosUserLogueado',
                params: { usuario: '@usuario', codigoCampo: '@codigoCampo' },
                headers: portalService.getHeadersServer()
            }
        });
    });
})();*/
(function () {
    'use strict';

    angular.module('app').controller('homeController', function (
        $scope,
        homeService,
        $state,
        $localStorage,
        $sessionStorage,
        toastr,
        portalService,
        configuracionService
        ) {
        $scope.Menu = [];
        $scope.showBorrar = false;
        $scope.toDelete = [];
        window.scrollTo(0, 0);

        //Redimenciona el tamaño del body
        var body = document.body;
        var menuLeft = document.getElementById('cbp-spmenu-s1');
        if (body.className.indexOf('cbp-spmenu-push') === -1 || !body.className)
            classie.toggle(body, 'cbp-spmenu-push');
        else if (menuLeft.className.indexOf('cbp-spmenu-left') !== -1 && menuLeft.className.indexOf('cbp-spmenu-open') === -1 && body.className.indexOf('cbp-spmenu-push-toright') !== -1)
            classie.toggle(menuLeft, 'cbp-spmenu-open');

        //$('.sidebar-menu').SidebarNav();

        var spinnerBar = spinnerBar || (function ($) {
            'use strict';

            // Creating modal dialog's DOM
            var $dialog = $(
                '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
                '<div class="modal-dialog modal-m">' +
                '<div class="modal-content">' +
                    '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
                    '<div class="modal-body">' +
                        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
                    '</div>' +
                '</div></div></div>');
            return {
                show: function (message, options) {
                    // Assigning defaults
                    if (typeof options === 'undefined') {
                        options = {};
                    }
                    if (typeof message === 'undefined') {
                        message = 'Cargando...';
                    }
                    var settings = $.extend({
                        dialogSize: 'm',
                        progressType: '',
                        onHide: null // This callback runs after the dialog was hidden
                    }, options);

                    // Configuring dialog
                    $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
                    $dialog.find('.progress-bar').attr('class', 'progress-bar');
                    if (settings.progressType) {
                        $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
                    }
                    $dialog.find('h3').text(message);
                    // Adding callbacks
                    if (typeof settings.onHide === 'function') {
                        $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                            settings.onHide.call($dialog);
                        });
                    }
                    // Opening dialog
                    $dialog.modal();
                },
                /**
                 * Closes dialog
                 */
                hide: function () {
                    $dialog.modal('hide');
                }
            };

        })(jQuery);

        var spinnerBarGuardado = spinnerBarGuardado || (function ($) {
            'use strict';

            // Creating modal dialog's DOM
            var $dialog = $(
                '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
                '<div class="modal-dialog modal-m">' +
                '<div class="modal-content">' +
                    '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
                    '<div class="modal-body">' +
                        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%;background-color: green;"></div></div>' +
                    '</div>' +
                '</div></div></div>');
            return {
                show: function (message, options) {
                    // Assigning defaults
                    if (typeof options === 'undefined') {
                        options = {};
                    }
                    if (typeof message === 'undefined') {
                        message = 'Guardando...';
                    }
                    var settings = $.extend({
                        dialogSize: 'm',
                        progressType: '',
                        onHide: null // This callback runs after the dialog was hidden
                    }, options);

                    // Configuring dialog
                    $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
                    $dialog.find('.progress-bar').attr('class', 'progress-bar');
                    if (settings.progressType) {
                        $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
                    }
                    $dialog.find('h3').text(message);
                    // Adding callbacks
                    if (typeof settings.onHide === 'function') {
                        $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                            settings.onHide.call($dialog);
                        });
                    }
                    // Opening dialog
                    $dialog.modal();
                },
                /**
                 * Closes dialog
                 */
                hide: function () {
                    $dialog.modal('hide');
                }
            };

        })(jQuery);

        $scope.load = function () {
            //$scope.showSpinner = true;
            spinnerBar.show();
            homeService.datosUsuario($sessionStorage.usuarioInfo.usuario, $localStorage.usuarioInfo.codigoCampo, $sessionStorage.usuarioInfo.idRol).then(function success(data) {
                var path = window.location.hash.split('/')[1] + '.' + window.location.hash.split('/')[2];
                $scope.Menu = data.menus;
                $scope.usuarioInfo = data;
                $scope.usuarioInfo.usuarioImagen = portalService.getUrlServer() + portalService.getFolderImagenUsuario() + '\\' + $scope.usuarioInfo.usuarioImagen + "?cache=" + (new Date()).getTime();
                //spinnerBar.hide();
                //for (var i = 0; i < $scope.Menu.length; i++) {
                //    if ($scope.Menu[i].urlMenu === path)
                //        $scope.Menu[i].activo = 'background-color:#E59866';
                //    else if ($scope.Menu[i].menu_Hijos !== null && $scope.Menu[i].menu_Hijos.length > 0) {
                //        $scope.Menu[i].activo = 'background-color:#FAE5D3';
                //        for (var j = 0; j < $scope.Menu[i].menu_Hijos.length; j++) {
                //            $scope.Menu[i].menu_Hijos[j].activo = 'background-color:#FAE5D3';
                //        }
                //    }
                //    else
                //        $scope.Menu[i].activo = 'background-color:#FAE5D3';
                //}
                //if (path === 'home.undefined') {
                //    $scope.Menu[0].activo = 'background-color:#E59866';
                //    //spinnerBar.hide();
                //state.go('home.inicio');
                //}
            }, function (error) {
                spinnerBar.hide();
                //$scope.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };
        $scope.load();

        $scope.desactivarMenuHijos = function (menu) {
            var index = $scope.Menu.indexOf(menu);
            for (var i = 0; i < $scope.Menu[index].menu_Hijos.length; i++) {
                $scope.Menu[index].menu_Hijos[i].activo = 'background-color:#FAE5D3';
            }
        };

        $scope.activar = function (id) {
            if (id === 9) {
                $scope.abrirModalCerrarSesion();
            }
            else {
                for (var i = 0; i < $scope.Menu.length; i++) {
                    if ($scope.Menu[i].idMenu === id)
                        $scope.Menu[i].activo = 'background-color:#E59866';
                    else if ($scope.Menu[i].menu_Hijos !== null && $scope.Menu[i].menu_Hijos.length > 0) {
                        for (var j = 0; j < $scope.Menu[i].menu_Hijos.length; j++) {
                            if ($scope.Menu[i].menu_Hijos[j].idMenu === id)
                                $scope.Menu[i].menu_Hijos[j].activo = 'background-color:#E59866';
                            else
                                $scope.Menu[i].menu_Hijos[j].activo = 'background-color:#FAE5D3';
                        }
                    }
                    else
                        $scope.Menu[i].activo = 'background-color:#FAE5D3';
                }
            }
        };

        $scope.abrirModalCerrarSesion = function () {
            $('#modalConfirmCerrarSesion').modal('show');
        };

        $scope.cerrarSesion = function () {
            $localStorage.usuarioInfo = undefined;
            $sessionStorage.usuarioInfo = undefined;
            $('#modalConfirmCerrarSesion').modal('hide');
            $state.go('login');
        };

        $scope.modificarImagenPerfil = function () {
            $scope.imageToUpload = [];
            $scope.showBorrar = false;
            spinnerBar.show();
            configuracionService.getDatosPerfilUsuario({ campo: $localStorage.usuarioInfo.codigoCampo, usuario: $sessionStorage.usuarioInfo.usuario, idRol: $sessionStorage.usuarioInfo.idRol }, function (data) {
                $scope.perfil = data;
                $scope.perfil.usuarioImagen = portalService.getUrlServer() + portalService.getFolderImagenUsuario() + '\\' + $scope.perfil.usuarioImagen + "?cache=" + (new Date()).getTime();
                spinnerBar.hide();
                $('#modalPerfil').modal('show');
            }, function (error) {
                spinnerBar.hide();
                //$scope.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        $scope.UploadImg = function ($files, $invalidFiles) {
            $scope.imageToUpload = $files;
            if ($scope.perfil.usuarioImagen) {
                $scope.perfil.usuarioImagen = undefined;
            }
        };

        $scope.selectUnselectImage = function (item) {
            if (!$scope.showBorrar) {
                $scope.toDelete = [];
                $scope.showBorrar = true;
                var index = $scope.toDelete.indexOf(item);
                if (index != -1) {
                    $scope.toDelete.splice(index, 1);
                } else {
                    $scope.toDelete.push(item)
                }
            }
            else {
                $scope.toDelete = [];
                $scope.showBorrar = false;
            }
        };

        $scope.ImageClass = function (item) {
            var index = $scope.toDelete.indexOf(item);
            if (index != -1) {
                return true;
            } else {
                return false;
            }
        };

        $scope.deleteImagefromModel = function () {
            if ($scope.toDelete != [] && $scope.toDelete.length > 0) {
                angular.forEach($scope.toDelete, function (value, key) {
                    var index = $scope.imageToUpload.indexOf(value);
                    var indexToDelete = $scope.toDelete.indexOf(value);
                    if (index != -1) {
                        $scope.imageToUpload.splice(index, 1);
                        $scope.toDelete.splice(indexToDelete, 1);
                        $scope.showBorrar = false;
                    }
                });
            }
            else {
                toastr.info('Debe seleccionar una imágen para borrar', 'Aviso');
            }
        };

        $scope.blockSpinner = function () {
            spinnerBar.show();
        };

        $scope.unBlockSpinner = function () {
            spinnerBar.hide();
        };

        $scope.blockSpinnerSave = function () {
            spinnerBarGuardado.show();
        };

        $scope.unBlockSpinnerSave = function () {
            spinnerBarGuardado.hide();
        };

        $scope.cerrarMenu = function () {
            menuLeft = document.getElementById('cbp-spmenu-s1');
            var showLeftPush = document.getElementById('showLeftPush');
            body = document.body;

            //showLeftPush.onclick = function () {
            classie.toggle(showLeftPush, 'active');
            classie.toggle(body, 'cbp-spmenu-push-toright');
            classie.toggle(menuLeft, 'cbp-spmenu-open');
            disableOther('showLeftPush');
            //};


            function disableOther(button) {
                if (button !== 'showLeftPush') {
                    classie.toggle(showLeftPush, 'disabled');
                }
            }

        };

        $scope.guardarImagenPerfil = function () {
            spinnerBar.show();
            if ($scope.imageToUpload[0])
                $scope.perfil.imagen = $scope.imageToUpload[0];
            $scope.perfil.usuario = $sessionStorage.usuarioInfo.usuario;
            $scope.perfil.$actualizarPerfilUsuario(function (data) {
                toastr.success('Datos actualizados', 'Éxito');
                spinnerBar.hide();
                $('#modalPerfil').modal('hide');
                $state.reload();
            }, function (error) {
                spinnerBar.hide();
                //$scope.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };
    });
})();

(function () {
    'use strict';

    angular
        .module('app')
        .factory('inicioService', inicioService);

    inicioService.$inject = ['$http', 'portalService'];

    function inicioService($http, portalService) {
        var service = {
            inicializar: inicializar,
            obtenerInconsistencias: obtenerInconsistencias,
            //prueba: prueba
        };

        function inicializar(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Dashboard/Get',
                params: { id: id },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function obtenerInconsistencias(codigoCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Campo/GetInconsistencias',
                params: { codigoCampo: codigoCampo },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            })
        };

        //function prueba(id) {
        //    return $http({
        //        method: 'GET',
        //        url: portalService.getUrlServer() + 'api/Bovino/getListaTags',
        //        params: { idCampo: id }
        //    }).then(
        //    function (data) {
        //        return data.data || [];
        //    });
        //}

        return service;
    }
    
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('inicioController', inicioController);

    inicioController.$inject = ['$scope', 'inicioService', 'toastr', '$localStorage', '$state', '$timeout'];

    function inicioController($scope, inicioService, toastr, $localStorage, $state, $timeout) {
        //$scope.showSpinner = true;
        window.scrollTo(0, 0);
        $scope.myChartObject = {};
        $scope.inicializar = inicializar();
        $scope.irAConflictos = irAConflictos;
        $scope.cerrar = cerrar;

        function inicializar() {
            //$scope.showSpinner = true;
            $scope.$parent.blockSpinner();
            inicioService.inicializar($localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                $scope.cantBovinos = data.bovinos;
                $scope.cantEventos = data.eventos;
                $scope.cantVentas = data.ventas;
                $scope.vacasPreniadas = data.vacasPreniadas;
                cargarGraficoRazas(data.graficoRaza);
                cargarGraficoCategorias(data.graficoCategorias);
                $scope.$parent.unBlockSpinner();
                //$scope.showSpinner = false;
                inicioService.obtenerInconsistencias($localStorage.usuarioInfo.codigoCampo)
                   .then(function success(data) {
                       $scope.$parent.unBlockSpinner();
                       if (data.inconsistencias > 0) {
                           $scope.inconsistencias = data.inconsistencias;
                           $('#modalInconsistencias').modal('show');
                       }
                   }, function error(error) {
                       toastr.error("Se ha producido un error, reintentar.");
                   });
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                //$scope.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function cerrar() {
            $timeout(function () {
                $('#modalInconsistencias').modal('hide');
            }, 500);            
        };

        function cargarGraficoRazas(graficoRaza) {
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoRazas');
                var chart = new google.visualization.PieChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ type: 'string', id: 'Raza' });
                dataTable.addColumn({ type: 'number', id: 'Cantidad' });
                for (var i = 0; i < graficoRaza.length; i++) {
                    dataTable.addRows([[graficoRaza[i].raza, graficoRaza[i].cantidadBovinos]]);
                }

                var options = {
                    'width': '100%',
                    'height': '100%',
                    'chartArea': { 'width': '100%', 'height': '100%' },
                    'legend': {
                        'position': 'left',
                        'textStyle': { 'fontSize': 18 }
                    }
                };
                chart.draw(dataTable, options);
            }
        };

        function cargarGraficoCategorias(graficoCatego) {
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);

            function drawChart() {
                var container = document.getElementById('graficoCategorias');
                var chart = new google.visualization.ColumnChart(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ type: 'string', id: 'Categoria', label: 'Categorias' });
                dataTable.addColumn({ type: 'number', id: 'Cantidad', label: 'Cantidad de bovinos' });
                for (var i = 0; i < graficoCatego.length; i++) {
                    dataTable.addRows([[graficoCatego[i].categoria, graficoCatego[i].cantidad]]);
                }

                var options = {
                    'theme': 'maximized',
                    'width': '100%',
                    'height': '100%',
                    //'chartArea': { 'left': 50, 'top': 30, 'right': 0, 'bottom': 50 },
                    'hAxis': { 'textPosition': 'out' }
                };
                chart.draw(dataTable, options);
            }
        };

        function irAConflictos() {
            $('#modalInconsistencias').modal('hide');
            $state.go('home.conflictos');
        };

        //function prueba() {
        //    inicioService.prueba($localStorage.usuarioInfo.codigoCampo).then(function success(data) {
        //        var hola = data;
        //    })
        //}
    }//fin controlador
})();

(function () {
    angular
        .module('app')
        .factory('consultarInseminacionService', consultarInseminacionService);

    consultarInseminacionService.$inject = ['$http', 'portalService'];

    function consultarInseminacionService($http, portalService) {
        var service = {
            inicializar: inicializar,
            consultarHembrasServicio: consultarHembrasServicio,
            consultarServicioSinConfirmar: consultarServicioSinConfirmar,
            getInseminacionesXFechaInsem: getInseminacionesXFechaInsem,
            consultarPreniadasXParir: consultarPreniadasXParir,
            eliminarInseminacion: eliminarInseminacion
        };

        return service;

        function inicializar(idCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Init',
                params: { idCampo: idCampo },
                headers: portalService.getHeadersServer()
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function consultarHembrasServicio() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/HembrasServicio',
                headers: portalService.getHeadersServer()
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function consultarServicioSinConfirmar(idCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/ServicioSinConfirmar',
                params: { idCampo: idCampo },
                headers: portalService.getHeadersServer()
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function getInseminacionesXFechaInsem(idCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/GetInseminacionesAgrupadasXFechaInsem',
                params: { idCampo: idCampo },
                headers: portalService.getHeadersServer()
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function consultarPreniadasXParir(idCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/PreniadasPorParir',
                params: { idCampo: idCampo },
                headers: portalService.getHeadersServer()
            }).then(
           function (data) {
               return data.data || [];
           });
        }

        function eliminarInseminacion(parametro) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Inseminacion/DeleteInseminacion',
                params: { parametro: parametro },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarInseminacionController', consultarInseminacionController);

    consultarInseminacionController.$inject = ['$scope', 'consultarInseminacionService', 'toastr', '$state', 'exportador', '$localStorage'];

    function consultarInseminacionController($scope, consultarInseminacionService, toastr, $state, exportador, $localStorage) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        vm.showHembrasParaServicio = true;
        vm.showServiciosSinConfirm = false;
        vm.showHembrasPreniadas = false;
        vm.showServSinConfirm = true;
        vm.showProxPartos = true;
        vm.showLactanciasActivas = true;
        var vistoServSinConfirm = 1;
        var vistoPreniadas = 1;
        var proxPartos = [];
        var tituloExcel = ''
        var idInseminacionAEliminar = 0;
        //metodos
        vm.inicializar = inicializar;
        vm.hembrasParaServicio = hembrasParaServicio;
        vm.serviciosSinConfirmar = serviciosSinConfirmar;
        vm.proximosPartos = proximosPartos;
        vm.lactanciasActivas = lactanciasActivas;
        vm.obtenerServSinConfirm = obtenerServSinConfirm;
        vm.obtenerProxPartos = obtenerProxPartos;
        vm.obtenerHembrasParaServicio = obtenerHembrasParaServicio;
        vm.obtenerLactanciasActivas = obtenerLactanciasActivas;
        vm.exportarExcelServSinConfirm = exportarExcelServSinConfirm;
        vm.exportarExcelVacasPreniadas = exportarExcelVacasPreniadas;
        vm.exportarPDFServSinConfirm = exportarPDFServSinConfirm;
        vm.exportarPDFVacasPreniadas = exportarPDFVacasPreniadas;
        vm.openPopUp = openPopUp;
        vm.eliminar = eliminar;
        inicializar();

        function inicializar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.showServSinConfirm = true;
            vm.showProxPartos = true;
            consultarInseminacionService.inicializar($localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                vm.init = data;
                serviciosSinConfirmar();
                proximosPartos();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function hembrasParaServicio() {
            if (vm.showHembrasParaServicio)
                vm.showHembrasParaServicio = false;
            else
                vm.showHembrasParaServicio = true;
        }

        function serviciosSinConfirmar() {
            if (vistoServSinConfirm === 1) {
                vistoServSinConfirm = 0;
                vm.showServSinConfirm = true;
                consultarInseminacionService.consultarServicioSinConfirmar($localStorage.usuarioInfo.codigoCampo).then(
                function success(data) {
                    var fechaHoy = new Date();
                    fechaHoy = moment(convertirFecha(fechaHoy));
                    vm.serviciosSinConfirm = {};
                    vm.serviciosSinConfirm.menor60 = Enumerable.From(data).Where(function (x) {
                        var fechaInsem = x.fechaInseminacion.split('/');
                        fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                        return fechaHoy.diff(fechaInsem, 'days') < 60
                    }).Count();
                    vm.serviciosSinConfirm.entre90y60 = Enumerable.From(data).Where(function (x) {
                        var fechaInsem = x.fechaInseminacion.split('/');
                        fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                        return fechaHoy.diff(fechaInsem, 'days') >= 60 && fechaHoy.diff(fechaInsem, 'days') < 90
                    }).Count();
                    vm.serviciosSinConfirm.mas90 = Enumerable.From(data).Where(function (x) {
                        var fechaInsem = x.fechaInseminacion.split('/');
                        fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                        return fechaHoy.diff(fechaInsem, 'days') > 90
                    }).Count();
                    //vm.showSpinner = false;
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
            else if (vm.init.serviciosSinConfirmar === 0) {
                toastr.info("En este momento no hay servicios sin confirmar", "Aviso");
                vm.showServSinConfirm = false;
            }
            else {
                vm.showServSinConfirm = false;
                vistoServSinConfirm = 1;
            }
        }

        //carga la tablita de servicios sin confirmar
        function obtenerServSinConfirm(rango) {
            $scope.$parent.blockSpinner();
            vm.showServiciosSinConfirm = true;
            vm.showHembrasPreniadas = false;
            vm.itemsPorPagina = 10;
            vm.rowCollection = [];
            var fechaHoy = new Date();
            fechaHoy = moment(convertirFecha(fechaHoy));
            consultarInseminacionService.getInseminacionesXFechaInsem($localStorage.usuarioInfo.codigoCampo).then(function success(data) {
                switch (rango) {
                    case 'menor60':
                        vm.rowCollection = Enumerable.From(data).Where(function (x) {
                            var fechaInsem = x.fechaInseminacion.split('/');
                            fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                            return fechaHoy.diff(fechaInsem, 'days') < 60
                        }).ToArray();
                        tituloExcel = 'Servicios de menos de 60 días sin confirmar';
                        if (vm.rowCollection.length === 0) {
                            toastr.info("En este momento no hay servicios sin confirmar para ese rango de días", "Aviso");
                        }
                        break;
                    case 'entre90y60':
                        vm.rowCollection = Enumerable.From(data).Where(function (x) {
                            var fechaInsem = x.fechaInseminacion.split('/');
                            fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                            return fechaHoy.diff(fechaInsem, 'days') >= 60 && fechaHoy.diff(fechaInsem, 'days') < 90
                        }).ToArray();
                        tituloExcel = 'Servicios de entre 60 y 90 días sin confirmar';
                        if (vm.rowCollection.length === 0) {
                            toastr.info("En este momento no hay servicios sin confirmar para ese rango de días", "Aviso");
                        }
                        break;
                    case 'mas90':
                        vm.rowCollection = Enumerable.From(data).Where(function (x) {
                            var fechaInsem = x.fechaInseminacion.split('/');
                            fechaInsem = moment(fechaInsem[2] + '/' + fechaInsem[1] + '/' + fechaInsem[0]);
                            return fechaHoy.diff(fechaInsem, 'days') > 90
                        }).ToArray();
                        tituloExcel = 'Servicios de más de 90 días sin confirmar';
                        if (vm.rowCollection.length === 0) {
                            toastr.info("En este momento no hay servicios sin confirmar para ese rango de días", "Aviso");
                        }
                        break;
                }
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function proximosPartos() {
            if (vistoPreniadas === 1) {
                vistoPreniadas = 0;
                vm.showProxPartos = true;
                var fechaHoy = new Date();
                vm.preniadasPorParir = {};
                fechaHoy = moment(convertirFecha(fechaHoy));
                consultarInseminacionService.consultarPreniadasXParir($localStorage.usuarioInfo.codigoCampo).then(
                function success(data) {
                    proxPartos = data;                    
                    vm.preniadasPorParir.prox10dias = Enumerable.From(data).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') < 10 && fechaParto.diff(fechaHoy, 'days') > 0
                    }).Count();
                    vm.preniadasPorParir.entre10y30dias = Enumerable.From(data).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') >= 10 && fechaParto.diff(fechaHoy, 'days') < 30 && fechaParto.diff(fechaHoy, 'days') > 0
                    }).Count();
                    vm.preniadasPorParir.entre30y60dias = Enumerable.From(data).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') >= 30 && fechaParto.diff(fechaHoy, 'days') < 60 && fechaParto.diff(fechaHoy, 'days') > 0
                    }).Count();
                    $scope.$parent.unBlockSpinner();
                    //vm.showSpinner = false;
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
            else if (vm.init.preniadasPorParir === 0) {
                vm.showProxPartos = false;
                toastr.info("En este momento no hay vacas preñadas por parir", "Aviso");
            }
            else {
                vm.showProxPartos = false;
                vistoPreniadas = 1;
            }

        }

        //carga a tablita de prox pariciones
        function obtenerProxPartos(rango) {
            vm.showServiciosSinConfirm = false;
            vm.showHembrasPreniadas = true;
            vm.itemsPorPagina = 10;
            vm.rowCollection = [];
            var fechaHoy = new Date();
            fechaHoy = moment(convertirFecha(fechaHoy));
            switch (rango) {
                case 'prox10dias':
                    vm.rowCollection = Enumerable.From(proxPartos).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') < 10
                    }).ToArray();
                    tituloExcel = 'Partos en los próximos 10 días';
                    if (vm.rowCollection.length === 0) {
                        toastr.info("En este momento no hay próximos partos para ese rango de días", "Aviso");
                    }
                    break;
                case 'entre10y30dias':
                    vm.rowCollection = Enumerable.From(proxPartos).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') >= 10 && fechaParto.diff(fechaHoy, 'days') < 30
                    }).ToArray();
                    tituloExcel = 'Partos entre los próximos 10 y 30 días';
                    if (vm.rowCollection.length === 0) {
                        toastr.info("En este momento no hay próximos partos para ese rango de días", "Aviso");
                    }
                    break;
                case 'entre30y60dias':
                    vm.rowCollection = Enumerable.From(proxPartos).Where(function (x) {
                        var fechaParto = x.fechaEstimadaParto.split('/');
                        fechaParto = moment(fechaParto[2] + '/' + fechaParto[1] + '/' + fechaParto[0]);
                        return fechaParto.diff(fechaHoy, 'days') >= 30 && fechaParto.diff(fechaHoy, 'days') < 60
                    }).ToArray();
                    tituloExcel = 'Partos entre los próximos 30 y 60 días';
                    if (vm.rowCollection.length === 0) {
                        toastr.info("En este momento no hay próximos partos para ese rango de días", "Aviso");
                    }
                    break;
            }
        }

        function obtenerHembrasParaServicio() {
            if (vm.init.hembrasParaServicio)
                $state.go('home.detalleInseminacion', { fecha: null, desde: 'hembrasParaServ' });
            else
                toastr.info("En este momento no hay vacas listas para servicio", "Aviso");
        }

        function obtenerLactanciasActivas() {
            if (vm.init.lactanciasActivas > 0)
                $state.go('home.detalleInseminacion', { fecha: null, desde: 'lactanciasActivas' });
            else
                toastr.info("En este momento no hay vacas en lactancia para mostrar", "Aviso");
        }

        function lactanciasActivas() {
            if (vm.showLactanciasActivas)
                vm.showLactanciasActivas = false;
            else
                vm.showLactanciasActivas = true;
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
            return año + '/' + mes + '/' + dia;
        }

        function exportarExcelServSinConfirm() {
            var titulos = [];
            titulos[0] = 'Tipo de Inseminación';
            titulos[1] = 'Fecha Inseminación';
            titulos[2] = 'Cantidad de bovinos que participaron';

            var propiedades = [];
            propiedades[0] = "tipoInseminacion";
            propiedades[1] = "fechaInseminacion";
            propiedades[2] = "cantidadVacas";

            if (vm.rowCollection.length > 0) {
                var fecha = new Date();
                fecha = convertirFecha(fecha);
                exportador.exportarExcel(tituloExcel + fecha, vm.rowCollection, titulos, null, propiedades, tituloExcel, function () {
                    toastr.success("Se ha exportado con Éxito", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function exportarPDFServSinConfirm() {
            var propiedades = [];
            propiedades[0] = "tipoInseminacion";
            propiedades[1] = "fechaInseminacion";
            propiedades[2] = "cantidadVacas";

            if (vm.rowCollection.length > 0) {
                var fecha = new Date();
                fecha = convertirFecha(fecha);

                var tab_text = '<html><head></head><body>';
                tab_text += "<h1 style='align:center;'>" + tituloExcel + "</h1>";
                //tab_text = tab_text + "<div><table border='1px' style='font-size:6px; width:10px;'>";
                //if (vm.filtro !== null) {
                //    var $html_filtro = "<thead><tr><td></td>";
                //    //for (var i = 0; i < filtro.Titulos.length; i++) {
                //    //    $html_filtro += "<td bgcolor='black' style='text-align:center; vertical-align:center'><b><font color='white'>" + filtro.Titulos[i] + "</font></b></td>";
                //    //}
                //    $html_filtro += "</tr></thead>";
                //    var $body = "<tr>";
                //for (var i = 0; i < filtro.length; i++) {
                //    if (filtro[i] === null || typeof filtro[i] !== "object") {
                //        var campo = filtro[i] !== null ? filtro[i] : "";
                //        $body += "<td style='text-align:center; vertical-align:center'> " + campo + " </td>";
                //    }
                //}
                //    $body += "</tr></tbody>";
                //    var newhtml_filtro = $html_filtro.concat($body.toString()).concat("</table></div>");
                //    tab_text = tab_text + newhtml_filtro.toString();
                //    //tab_text = tab_text + "<tr></tr>" + "<tr></tr>";
                //}
                tab_text += "<div style='border-width: 2px; border-style: dotted; padding: 1em; font-size:120%;line-height: 1.5em;'><table border='1px' style='font-size:5px; width:6000px'>";
                var $html = "<thead><tr>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Fecha Inseminación </font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Tipo de Inseminación</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Cantidad de bovinos que participaron</font></b></td>";
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

                exportador.exportarPDF(tituloExcel + fecha, tab_text, function () {
                    toastr.success("Se ha exportado con Éxito.", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function exportarExcelVacasPreniadas() {
            var titulos = [];
            titulos[0] = 'Tipo de Inseminación';
            titulos[1] = 'Fecha Inseminación';
            titulos[2] = 'Fecha estimada de parto';

            var propiedades = [];
            propiedades[0] = "tipoInseminacion";
            propiedades[1] = "fechaInseminacion";
            propiedades[2] = "fechaEstimadaParto";

            if (vm.rowCollection.length > 0) {
                var fecha = new Date();
                fecha = convertirFecha(fecha);
                exportador.exportarExcel(tituloExcel + fecha, vm.rowCollection, titulos, null, propiedades, tituloExcel, function () {
                    toastr.success("Se ha exportado con Éxito", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function exportarPDFVacasPreniadas() {
            var propiedades = [];
            propiedades[0] = "tipoInseminacion";
            propiedades[1] = "fechaInseminacion";
            propiedades[2] = "fechaEstimadaParto";

            if (vm.rowCollection.length > 0) {
                var fecha = new Date();
                fecha = convertirFecha(fecha);

                var tab_text = '<html><head></head><body>';
                tab_text += "<h1 style='align:center;'>" + tituloExcel + "</h1>";
                //tab_text = tab_text + "<div><table border='1px' style='font-size:6px; width:10px;'>";
                //if (vm.filtro !== null) {
                //    var $html_filtro = "<thead><tr><td></td>";
                //    //for (var i = 0; i < filtro.Titulos.length; i++) {
                //    //    $html_filtro += "<td bgcolor='black' style='text-align:center; vertical-align:center'><b><font color='white'>" + filtro.Titulos[i] + "</font></b></td>";
                //    //}
                //    $html_filtro += "</tr></thead>";
                //    var $body = "<tr>";
                //for (var i = 0; i < filtro.length; i++) {
                //    if (filtro[i] === null || typeof filtro[i] !== "object") {
                //        var campo = filtro[i] !== null ? filtro[i] : "";
                //        $body += "<td style='text-align:center; vertical-align:center'> " + campo + " </td>";
                //    }
                //}
                //    $body += "</tr></tbody>";
                //    var newhtml_filtro = $html_filtro.concat($body.toString()).concat("</table></div>");
                //    tab_text = tab_text + newhtml_filtro.toString();
                //    //tab_text = tab_text + "<tr></tr>" + "<tr></tr>";
                //}
                tab_text += "<div style='border-width: 2px; border-style: dotted; padding: 1em; font-size:120%;line-height: 1.5em;'><table border='1px' style='font-size:5px; width:6000px'>";
                var $html = "<thead><tr>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Fecha Inseminación</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Tipo de Inseminación</font></b></td>";
                $html += "<td style='width:500; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Fecha estimada de parto</font></b></td>";
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

                exportador.exportarPDF(tituloExcel + fecha, tab_text, function () {
                    toastr.success("Se ha exportado con Éxito.", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function openPopUp(fecha, id) {
            vm.fecha = fecha;
            if (id !== '')
                idInseminacionAEliminar = id;
            $('#modalConfirmEliminar').modal('show');
        }

        function eliminar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            var parametro = '';
            if (idInseminacionAEliminar !== 0)
                parametro = idInseminacionAEliminar;
            else
                parametro = vm.fecha;
            consultarInseminacionService.eliminarInseminacion(parametro).then(function success() {
                $('#modalConfirmEliminar').modal('hide');
                toastr.success('Inseminación eliminada con éxito', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $state.reload();
            }, function (error) {
                $('#modalConfirmEliminar').modal('hide');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .factory('detalleInseminacionService', detalleInseminacionService);

    detalleInseminacionService.$inject = ['$http', 'portalService'];

    function detalleInseminacionService($http, portalService) {
        var service = {
            getInseminacion: getInseminacion,
            getHembrasServicio: getHembrasServicio,
            getLactancias: getLactancias
        };

        function getInseminacion(fecha) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Get',
                params: { fechaInseminacion: fecha },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function getHembrasServicio() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/HembrasServicio',
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function getLactancias() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Lactancias',
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleInseminacionController', detalleInseminacionController);

    detalleInseminacionController.$inject = ['$scope', 'detalleInseminacionService', '$stateParams', 'toastr'];

    function detalleInseminacionController($scope, detalleInseminacionService, $stateParams, toastr) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        vm.inseminacion = {};
        vm.desde = $stateParams.desde;
        vm.itemsPorPaginaTacto = 10;
        vm.disabled = true;
        //funciones
        vm.inicializar = inicializar();


        function inicializar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.disabled = true;
            vm.itemsPorPagina = 9;            
            if ($stateParams.fecha !== null) {
                vm.fecha = $stateParams.fecha;
                detalleInseminacionService.getInseminacion($stateParams.fecha).then(function success(data) {
                    vm.inseminacion = data;
                    if (vm.inseminacion.fechaEstimadaNacimiento !== '') {
                        vm.vaca = vm.inseminacion.listaBovinos[0];
                        vm.toro = vm.inseminacion.listaToros[0];
                        vm.tactos = vm.inseminacion.tactos;
                    }
                    else {
                        vm.rowCollection = vm.inseminacion.listaBovinos;
                        vm.torosCollection = vm.inseminacion.listaToros;
                    }                        
                    vm.tituloTabla = 'Bovinos que participaron de la inseminación';
                    vm.disabled = false;
                    $scope.$parent.unBlockSpinner();
                    //vm.showSpinner = false;
                }, function error(error) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
            else if (vm.desde === 'hembrasParaServ') {
                detalleInseminacionService.getHembrasServicio().then(function successs(data) {
                    vm.rowCollection = data;
                    vm.tituloTabla = 'Hembras para servicio';
                    vm.disabled = false;
                    $scope.$parent.unBlockSpinner();
                    //vm.showSpinner = false;
                }, function error(error) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                })
            }
            else if (vm.desde === 'lactanciasActivas') {
                detalleInseminacionService.getLactancias().then(function successs(data) {
                    vm.rowCollection = data;
                    vm.tituloTabla = 'Vacas dando de lactar';
                    vm.disabled = false;
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                }, function error(error) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                })
            }
            else
                $scope.$parent.unBlockSpinner();
            //vm.showSpinner = false;
        }//fin inicializar


    }//fin archivo
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('modificarInseminacionService', modificarInseminacionService);

    modificarInseminacionService.$inject = ['$http', 'portalService'];

    function modificarInseminacionService($http, portalService) {
        var service = {
            getInseminacion: getInseminacion,
            getHembrasServicio: getHembrasServicio,
            getLactancias: getLactancias,
            modificar: modificar,
            update: update
        };

        function getInseminacion(fecha) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Get',
                params: { fechaInseminacion: fecha },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function getHembrasServicio() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/HembrasServicio',
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function getLactancias() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Inseminacion/Lactancias',
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function modificar(inseminacion, lista, listaT , fechaInsemOriginal) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Inseminacion',
                params: { value: inseminacion, listaVacas: lista, listaToros: listaT, fechaAnterior: fechaInsemOriginal },
                headers: portalService.getHeadersServer()
            })
        }

        function update(inseminacion) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Inseminacion/Update',
                params: { value: inseminacion },
                headers: portalService.getHeadersServer()
            })
        }
        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarInseminacionController', modificarInseminacionController);

    modificarInseminacionController.$inject = ['$scope', 'modificarInseminacionService', 'toastr', '$stateParams'];

    function modificarInseminacionController($scope, modificarInseminacionService, toastr, $stateParams) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.habilitar = false;
        //funciones
        vm.modificar = modificar;
        vm.inicializar = inicializar();
        vm.getFecha = getFecha;
        vm.getFechaParicion = getFechaParicion;
        vm.openPopUp = openPopUp;
        vm.openPopUpToro = openPopUpToro;
        vm.eliminarToro = eliminarToro;
        vm.eliminar = eliminar;
        vm.antesDeModificar = antesDeModificar;
        //variables
        vm.fechaDeHoy = new Date();
        vm.desde = $stateParams.desde;
        vm.showEliminar = true;
        $('#datetimepicker4').datetimepicker();
        var idVacaEliminar = 0;
        var idToroEliminar = 0;
        var fechaInseminacionOriginal = '';
        var lista = [];
        var listaToros = [];
        $('#datetimepicker6').datetimepicker();

        function inicializar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.habilitar = false;
            vm.fecha = $stateParams.fecha;
            modificarInseminacionService.getInseminacion($stateParams.fecha).then(function success(data) {
                //inseminacion
                vm.inseminacion = data;
                vm.inseminacion.idTipoInseminacion = vm.inseminacion.idTipoInseminacion.toString();
                fechaInseminacionOriginal = vm.inseminacion.fechaInseminacion;
                if (vm.inseminacion.fechaEstimadaNacimiento !== '') {
                    $('#datetimepicker5').datetimepicker();                    
                    vm.vaca = vm.inseminacion.listaBovinos[0];
                    if (vm.inseminacion.listaToros)
                        vm.toro = vm.inseminacion.listaToros[0];
                    vm.tactos = vm.inseminacion.tactos;
                    for (var i = 0; i < vm.tactos.length; i++) {
                        vm.tactos[i].idTipoTacto = vm.tactos[i].idTipoTacto.toString();
                    }
                }
                else {
                    vm.rowCollection = vm.inseminacion.listaBovinos;
                    vm.torosCollection = vm.inseminacion.listaToros;
                }
                vm.tituloTabla = 'Vacas que participaron de la inseminación';
                vm.tiposInseminacion = [
                    { idTipoInseminacion: '1', descripcion: 'Artificial' },
                    { idTipoInseminacion: '2', descripcion: 'Montura' }
                ];
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                vm.habilitar = true;
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function antesDeModificar() {
            //vm.showSpinner = true;            
            vm.habilitar = false;
            vm.showEliminar = true;
            if (vm.rowCollection !== undefined) {
                for (var i = 0; i < vm.rowCollection.length; i++) {
                    lista.push(vm.rowCollection[i].idBovino);
                }
            }
            else
                lista.push(vm.vaca.idBovino);
            if (vm.torosCollection) {
                for (var i = 0; i < vm.torosCollection.length; i++) {
                    listaToros.push(vm.torosCollection[i].idBovino);
                }
            }
            else
                listaToros.push(vm.toro.idBovino);
            vm.inseminacion.tipoInseminacion = vm.inseminacion.idTipoInseminacion;
            if ((lista.length === 0 && vm.inseminacion.tipoInseminacion === 1) || (lista.length === 0 && vm.inseminacion.tipoInseminacion === '2' && listaToros.length === 0))
                $('#modalConfirmEliminarInseminacion').modal('show');
            else if (lista.length > 0 && vm.inseminacion.tipoInseminacion === '2' && listaToros.length === 0)
                $('#modalConfirmEliminarInseminacionSinToros').modal('show');
            else
                modificar();
        };

        function modificar() {
            if (listaToros.length === 0)
                vm.inseminacion.tipoInseminacion = 1;
            $scope.$parent.blockSpinnerSave();
            if (vm.desde === 'servicioSinConfirm') {
                modificarInseminacionService.modificar(vm.inseminacion, lista.toString(), listaToros.toString(), fechaInseminacionOriginal).then(function success(data) {
                    //vm.habilitar = false;
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    $('#modalConfirmEliminarInseminacion').modal('hide');
                    $('#modalConfirmEliminarInseminacionSinToros').modal('hide');
                    vm.showEliminar = false;
                    toastr.success('Se modificó la inseminación con éxito ', 'Éxito');
                }, function error(data) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBllockSpinnerSave();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
            else {
                modificarInseminacionService.update(vm.inseminacion).then(function success(data) {
                    //vm.habilitar = false;
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    $('#modalConfirmEliminarInseminacion').modal('hide');
                    toastr.success('Se modificó la inseminación con éxito ', 'Éxito');
                }, function error(data) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinnerSave();
                    toastr.error('La operación no se pudo completar', 'Error');
                })
            }
        }

        function openPopUp(id, caravana) {
            idVacaEliminar = id;
            vm.nroCaravana = caravana;
            $('#modalConfirmEliminarVaca').modal('show');
        }

        function eliminar() {
            for (var i = 0; i < vm.rowCollection.length; i++) {
                if (vm.rowCollection[i].idBovino === idVacaEliminar)
                    vm.rowCollection.splice(i, 1);
            }
            $('#modalConfirmEliminarVaca').modal('hide');
        }

        function openPopUpToro(id, caravana) {
            idToroEliminar = id;
            vm.nroCaravanaToro = caravana;
            $('#modalConfirmEliminarToro').modal('show');
        }

        function eliminarToro() {
            for (var i = 0; i < vm.torosCollection.length; i++) {
                if (vm.torosCollection[i].idBovino === idToroEliminar)
                    vm.torosCollection.splice(i, 1);
            }
            $('#modalConfirmEliminarToro').modal('hide');
        }

        function convertirFecha(fecha) {
            var dia, mes, año;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = fecha.getMonth().toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            return dia + '/' + mes + '/' + año;
        };

        function getFecha() {
            vm.inseminacion.fechaInseminacion = $('#datetimepicker4')[0].value;
            var fechaInseminacion = new Date(vm.inseminacion.fechaInseminacion.substring(6, 10), parseInt(vm.inseminacion.fechaInseminacion.substring(3, 5)) - 1, vm.inseminacion.fechaInseminacion.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaInseminacion > fechaHoy) {
                vm.formModificarInseminacion.fechaInseminacion.$setValidity("max", false);
            }
            else {
                vm.formModificarInseminacion.fechaInseminacion.$setValidity("max", true);
            }
            if (fechaInseminacion < fechaMin)
                vm.formModificarInseminacion.fechaInseminacion.$setValidity("min", false);
            else
                vm.formModificarInseminacion.fechaInseminacion.$setValidity("min", true);
        }

        function getFechaParicion() {
            vm.inseminacion.fechaEstimadaNacimiento = $('#datetimepicker5')[0].value;
            var fechaEstNacimiento = new Date(vm.inseminacion.fechaEstimadaNacimiento.substring(6, 10), parseInt(vm.inseminacion.fechaEstimadaNacimiento.substring(3, 5)) - 1, vm.inseminacion.fechaEstimadaNacimiento.substring(0, 2));
            var fechaHoy = new Date();
            var fechaMin = new Date(2000, 1, 1);
            if (fechaEstNacimiento < fechaMin)
                vm.formModificarInseminacion.fechaParicion.$setValidity("min", false);
            else
                vm.formModificarInseminacion.fechaParicion.$setValidity("min", true);
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('loginService', loginService);

    loginService.$inject = ['$http', 'portalService'];

    function loginService($http, portalService) {
        var service = {
            consultar: consultar
        };

        function consultar(credenciales) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Usuario/Validar',
                params: { usuario: credenciales }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', 'toastr', 'loginService', '$localStorage', '$state', '$sessionStorage'];

    function loginController($scope, toastr, loginService, $localStorage, $state, $sessionStorage) {
        var vm = $scope;
        vm.usuario = {};
        vm.ocultarUsuario = true;
        //vm.showSpinner = false;

        vm.inicializar = inicializar();
        vm.aceptar = aceptar;

        var waitingDialog = waitingDialog || (function ($) {
            'use strict';

            // Creating modal dialog's DOM
            var $dialog = $(
                '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
                '<div class="modal-dialog modal-m">' +
                '<div class="modal-content">' +
                    '<div class="modal-header"><h3 style="margin:0;"></h3></div>' +
                    '<div class="modal-body">' +
                        '<div class="progress progress-striped active" style="margin-bottom:0;"><div class="progress-bar" style="width: 100%"></div></div>' +
                    '</div>' +
                '</div></div></div>');

            return {
                /**
                 * Opens our dialog
                 * @param message Custom message
                 * @param options Custom options:
                 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
                 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
                 */
                show: function (message, options) {
                    // Assigning defaults
                    if (typeof options === 'undefined') {
                        options = {};
                    }
                    if (typeof message === 'undefined') {
                        message = 'Cargando...';
                    }
                    var settings = $.extend({
                        dialogSize: 'm',
                        progressType: '',
                        onHide: null // This callback runs after the dialog was hidden
                    }, options);

                    // Configuring dialog
                    $dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
                    $dialog.find('.progress-bar').attr('class', 'progress-bar');
                    if (settings.progressType) {
                        $dialog.find('.progress-bar').addClass('progress-bar-' + settings.progressType);
                    }
                    $dialog.find('h3').text(message);
                    // Adding callbacks
                    if (typeof settings.onHide === 'function') {
                        $dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
                            settings.onHide.call($dialog);
                        });
                    }
                    // Opening dialog
                    $dialog.modal();
                },
                /**
                 * Closes dialog
                 */
                hide: function () {
                    $dialog.modal('hide');
                }
            };

        })(jQuery);

        function inicializar() {
            var obj = document.getElementById('btn_login');
            obj.click();
            if ($sessionStorage.usuarioInfo !== undefined) {
                vm.usuario.usuario = $sessionStorage.usuarioInfo.usuario;
                vm.ocultarUsuario = false;
            }
        }

        function aceptar() {
            if (validar()) {
                $('#login-modal').modal('hide');
                waitingDialog.show();
                //vm.showSpinner = true;
                $scope.usuario.idRol = 1;
                loginService.consultar($scope.usuario)
                    .then(function success(data) {
                        if (data.resultado === 1) {
                            if ($sessionStorage.usuarioInfo === undefined) {
                                $sessionStorage.usuarioInfo = {};
                                $sessionStorage.usuarioInfo.usuario = vm.usuario.usuario;
                                $sessionStorage.usuarioInfo.idRol = vm.usuario.idRol;
                                $sessionStorage.usuarioInfo.token = data.token;
                            }
                            //$('#login-modal').modal('hide');
                            $state.go('seleccionCampo');
                        }
                        else {
                            toastr.error("Los datos son inválidos. Por favor revíselos e intente nuevamente.");
                            $('#login-modal').modal('show');
                        }                            
                        //setTimeout()
                        waitingDialog.hide();
                        //vm.showSpinner = false;
                    },
                    function error(error) {
                        //vm.showSpinner = false;
                        waitingDialog.hide();
                        toastr.error("Ha ocurrido un problema. Reintente nuevamente.");
                        $('#login-modal').modal('show');
                    });
            }
        }

        function validar() {
            if (isUndefinedOrNull(vm.usuario.usuario)) {
                toastr.info("El usuario se encuentra vacío");
                return false;
            }
            if (isUndefinedOrNull(vm.usuario.pass)) {
                toastr.info("La contraseña se encuentra vacía");
                return false;
            }
            return true;
        }

        function isUndefinedOrNull(val) {
            return angular.isUndefined(val) || val === null || val == undefined
        }
    }
})();

(function () {
    angular.module('app')
        .factory('alimentoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Alimento/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    url: portalService.getUrlServer() + 'api/Alimento/GetList',
                    params: {
                        idCampo: '@idCampo'
                    },
                    isArray: true
                }
            });
        });
})();
(function () {
    angular.module('app')
        .factory('antibioticoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Antibiotico/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    url: portalService.getUrlServer() + 'api/Antibiotico/GetList',
                    params: {
                        idCampo: '@idCampo'
                    },
                    isArray: true
                }
            });
        });
})();
(function () {
    angular.module('app')
        .factory('categoriaService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Categoria/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo'
                    },
                    isArray: true
                }
            });
        });
})();
(function () {
    angular.module('app')
        .factory('establecimientoOrigenService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/EstablecimientoOrigen/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo'
                    },
                    isArray: true
                }
            });
        });
})();
(function () {
    angular.module('app')
        .factory('estadoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Estado/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo'
                    },
                    isArray: true
                }
            });
        });
})();
(function () {
    angular.module('app')
        .factory('razaService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Raza/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo'
                    },
                    isArray: true
                }
            });
        });
})();
(function () {
    angular.module('app')
        .factory('rodeoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Rodeo/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    url: portalService.getUrlServer() + 'api/Rodeo/GetList',
                    params: {
                        campo: '@campo'
                    },
                    isArray: true
                }
            });
        });
})();
(function () {
    angular.module('app')
        .factory('vacunaService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Vacuna/', {}, {
                save: {
                    method: 'POST',
                    headers: portalService.getHeadersServer()
                },
                get: {
                    method: 'GET',
                    headers: portalService.getHeadersServer(),
                    url: portalService.getUrlServer() + 'api/Vacuna/GetList',
                    params: {
                        idCampo: '@idCampo'
                    },
                    isArray: true
                }
            });
        });
})();
(function () {
    'use strict';

    angular.module('app').service('portalService', function ($sessionStorage, $localStorage) {//usuarioInfo) {
        var portalService = {};

        portalService.getUrlServer = function () {
            return "http://localhost:2424/";
            //return "http://farmix.somee.com/";
            //return "http://ec2-54-232-203-99.sa-east-1.compute.amazonaws.com:2424/";
        };

        portalService.getHeadersServer = function () {
            var headers = { 'Authorization': $sessionStorage.usuarioInfo.token };
            return headers;
        };

        portalService.getContentUndefined = function () {
            var headers = { 'Authorization': $sessionStorage.usuarioInfo.token, 'Content-Type': undefined };
            return headers;
        };

        portalService.getFolderImagenCampo = function () {
            return "Images\\Campo\\";
        };

        portalService.getFolderImagenUsuario = function () {
            return "Images\\Usuario\\";
        };

        /*portal.getDefaultUsuarioImagen = function () {
            return "../images/portal/default-user.png";
        };

        portal.getDefaultUsuarioRecursos = function () {
            return "recursos.es-AR.json";
        };

        portal.getHeadersServer = function () {
            var headers = { 'Authorization': usuarioInfo.getToken() };
            return headers;
        };
        portal.getContentUndefined = function () {
            var headers = { 'Authorization': usuarioInfo.getToken(), 'Content-Type': undefined };
            return headers;
        };*/

        return portalService;
    });
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('presentacion', presentacion);

    presentacion.$inject = ['$http'];

    function presentacion($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() { }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('presentacionController', presentacionController);

    presentacionController.$inject = ['$scope'];

    function presentacionController($scope) {
        var vm = this;
        vm.title = 'caca';

        activate();

        function activate() { }
    }
})();

(function () {
    angular.module('app')
        .factory('reporteBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Reportes/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/Bovinos',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo'
                    },
                    isArray: true
                }
            });
        });
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteBovinoController', reporteBovinoController);

    reporteBovinoController.$inject = ['$scope', 'reporteBovinoService', 'exportador', '$localStorage'];

    function reporteBovinoController($scope, reporteBovinoService, exportador, $localStorage) {
        var vm = $scope;

        //funciones
        vm.inicializar = inicializar();


        //variables
        window.scrollTo(0, 0);
        vm.disabledExportar = 'disabled';
        vm.bovinos = [];
        vm.itemsPorPagina = 50;


        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            reporteBovinoService.inicializar({
                codigoCampo: $localStorage.usuarioInfo.codigoCampo
            }, function (data) {
                vm.rowCollection = data;
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }
    }
})();
(function () {
    angular.module('app')
        .factory('reporteInseminacionService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Inseminacion/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/Inseminacion/:idAmbitoEstado/:idCampo',
                    headers: portalService.getHeadersServer(),
                    params: {
                        idAmbitoEstado: '@idAmbitoEstado',
                        idCampo: '@idCampo'
                    },
                    isArray: false
                }
            });
        });
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteInseminacionController', reporteInseminacionController);

    reporteInseminacionController.$inject = ['$scope', 'reporteInseminacionService'];

    function reporteInseminacionController($scope, reporteInseminacionService) {
        var vm = $scope;

        //funciones
        vm.inicializar = inicializar();


        //variables
        vm.disabledExportar = 'disabled';
        vm.itemsPorPagina = 50;
        vm.tablaActiva = 0;
        vm.hembrasParaServir = [{
            "orden": 1,
            "caravana": 12133,
            "raza": "Rosa Pennington",
            "categoria": "Fran Tran",
            "edad": "1 años 5 meses",
            "peso": 326,
            "estado": "Shelly Mclaughlin",
            "rodeo": "Georgia",
            "partos": 1
        }];
        vm.lactanciasActivas = [];
        vm.preniadas = [];
        vm.serviciosSinConfirmar = [];


        inicializar()


        function inicializar() {
            $scope.$parent.unBlockSpinner();
            //reporteInseminacionService.inicializar({
            //    idAmbitoEstado: '1',
            //    idCampo: $localStorage.usuarioInfo.codigoCampo
            //}, function (data) {
            //    vm.rowCollection = data.bovinos;

            //    vm.showSpinner = true;
            //}, function error(error) {
            //    vm.showSpinner = false;
            //    toastr.error('Ha ocurrido un error, reintentar', 'Error');
            //});
        }//inicializar


    }
})();
(function () {
    angular.module('app')
        .factory('consultarReportesService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Inconsistencia', {}, {
                obtenerReportes: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Inconsistencia/GetList',
                    headers: portalService.getHeadersServer(),
                    isArray: true
                }
            });
        });
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarReportesController', consultarReportesController);

    consultarReportesController.$inject = ['$scope'];

    function consultarReportesController($scope) {
        var vm = $scope;
        
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .factory('seleccionCampoService', seleccionCampoService);

    seleccionCampoService.$inject = ['$http', 'portalService'];

    function seleccionCampoService($http, portalService) {
        var service = {
            consultar: consultar
        };

        function consultar(usuario, idRol) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Campo/GetList',
                params: { usuario: usuario, idRol: idRol },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('seleccionCampoController', seleccionCampoController);

    seleccionCampoController.$inject = ['$scope', 'toastr', 'seleccionCampoService', '$localStorage', '$state', '$sessionStorage', 'registrarCampoService', 'portalService'];

    function seleccionCampoController($scope, toastr, seleccionCampoService, $localStorage, $state, $sessionStorage, registrarCampoService, portalService) {
        var vm = $scope;
        vm.usuario = {};
        window.scrollTo(0, 0);

        vm.inicializar = inicializar();
        vm.seleccionarCampo = seleccionarCampo;
        vm.validarCantCampos = validarCantCampos;
        $localStorage.usuarioInfo = {};
        //var imagenes = ['../../images/campo1.jpg', '../../images/campo2.jpg', '../../images/campo3.jpg', '../../images/campo4.jpg', '../../images/campo5.jpg'];

        function inicializar() {
            seleccionCampoService.consultar($sessionStorage.usuarioInfo.usuario, $sessionStorage.usuarioInfo.idRol)
                   .then(function success(data) {
                       $scope.campos = data;
                       for (var i = 0; i < $scope.campos.length; i++) {
                           //if (!$scope.campos[i].imagen)
                           //$scope.campos[i].imagen = imagenes[i];
                           //else
                           $scope.campos[i].imagen = portalService.getUrlServer() + portalService.getFolderImagenCampo() + $scope.campos[i].codigoCampo + '\\' + $scope.campos[i].imagen + "?cache=" + (new Date()).getTime();
                       }
                   }, function error(error) {
                       toastr.error("Se ha producido un error, reintentar.");
                   });
        };

        function seleccionarCampo(codigo) {
            $localStorage.usuarioInfo.codigoCampo = codigo;
            $state.go('home.inicio');
        };

        function validarCantCampos() {
            registrarCampoService.validarCantCamposUsuario({ usuario: $sessionStorage.usuarioInfo.usuario }, function success(data) {
                if (data.resultado)
                    $state.go('registrarCampo');
                else
                    toastr.info("No puede agregar mas campos, verifique su plan contratado.", "Aviso");
            }, function error(error) {
                toastr.error("Se ha producido un error, reintentar.");
            });
        };
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .factory('consultarTrazabilidadService', consultarTrazabilidadService);

    consultarTrazabilidadService.$inject = ['$http', 'portalService'];

    function consultarTrazabilidadService($http, portalService) {
        var service = {
            getListaEventos: getListaEventos,
            eliminarEvento: eliminarEvento
        };

        function getListaEventos(filtro) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/GetListaEventos',
                params: { filtro: filtro },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function eliminarEvento(id) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Evento/DeleteEvento',
                params: { idEvento: id },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('tipoEventoService', tipoEventoService);

    tipoEventoService.$inject = ['$http', 'portalService'];

    function tipoEventoService($http, portalService) {
        var service = {
            inicializar: inicializar,
            insert: insert
        };

        function inicializar() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/TipoEvento/GetList',
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        function insert(evento, lista) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Evento/Insert',
                params:{
                    evento: evento,
                    lista: lista
            }
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarTrazabilidadController', consultarTrazabilidadController);

    consultarTrazabilidadController.$inject = ['$scope', 'tipoEventoService', 'toastr', 'consultarTrazabilidadService', '$state', 'exportador', '$localStorage'];

    function consultarTrazabilidadController($scope, tipoEventoService, toastr, consultarTrazabilidadService, $state, exportador, $localStorage) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.disabled = 'disabled';
        vm.disabledExportar = 'disabled';
        vm.tipoEventoPopUp = '';
        vm.fecha = '';
        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.exportarExcel = exportarExcel;
        vm.openPopUp = openPopUp;
        vm.eliminar = eliminar;
        vm.getFechaDesde = getFechaDesde;
        vm.getFechaHasta = getFechaHasta;
        vm.exportarPDF = exportarPDF;
        //variables       
        vm.filtro = {};
        vm.cursor = '';
        var ultimoIndiceVisto = 0;
        var idEventoAEliminar = 0;
        var idManejo = [];
        var idAlimenticio = [];
        vm.fechaDeHoy = new Date();
        $('#datetimepicker4').datetimepicker();
        $('#datetimepicker5').datetimepicker();

        function inicializar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.disabledExportar = 'disabled';
            vm.disabled = 'disabled';
            vm.itemsPorPagina = 9;
            tipoEventoService.inicializar({}).then(function success(data) {
                vm.Eventos = data;
                vm.filtro.idTipoEvento = '0';
                vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
                vm.disabled = '';
                consultar();
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function consultar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            if (vm.filtro.fechaDesde !== undefined) {
                if (typeof vm.filtro.fechaDesde === "string")
                    vm.filtro.fechaDesde = new Date(vm.filtro.fechaDesde.split('/')[2], (parseInt(vm.filtro.fechaDesde.split('/')[1]) - 1).toString(), vm.filtro.fechaDesde.split('/')[0]);
                vm.filtro.fechaDesde = convertirFecha(vm.filtro.fechaDesde);
            }
            if (vm.filtro.fechaHasta !== undefined) {
                if (typeof vm.filtro.fechaHasta === "string")
                    vm.filtro.fechaHasta = new Date(vm.filtro.fechaHasta.split('/')[2], (parseInt(vm.filtro.fechaHasta.split('/')[1]) - 1).toString(), vm.filtro.fechaHasta.split('/')[0]);
                vm.filtro.fechaHasta = convertirFecha(vm.filtro.fechaHasta);
            }
            if (vm.filtro.numCaravana === null) {
                vm.filtro.numCaravana = undefined;
                $('#timeline').hide();
            }
            else if (vm.filtro.numCaravana !== undefined && vm.filtro.numCaravana !== null) {
                $('#timeline').show();
            }
            consultarTrazabilidadService.getListaEventos(angular.toJson(vm.filtro, false)).then(function success(data) {
                if (data.length === 0) {
                    vm.disabledExportar = 'disabled';
                    //vm.showSpinner = false;
                    vm.disabled = '';
                    vm.rowCollection = [];
                    $('#timeline').hide();
                    toastr.info("No se ha encontrado ningún resultado para esta búsqueda", "Aviso");
                }
                else {
                    vm.rowCollection = data;
                    if (vm.filtro.numCaravana !== undefined && vm.filtro.numCaravana !== null)
                        cargarLineaTiempoEventos();
                    if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                    //vm.showSpinner = false;
                    vm.disabled = '';
                    vm.disabledExportar = '';
                }
                $scope.$parent.unBlockSpinner();
            }), function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            };
        };

        function convertirFecha(fecha) {
            var dia, mes, año, hora, min;
            dia = fecha.getDate().toString();
            if (dia.length === 1)
                dia = '0' + dia;
            mes = (fecha.getMonth() + 1).toString();
            if (mes.length === 1)
                mes = '0' + mes;
            año = fecha.getFullYear().toString();
            hora = fecha.getHours().toString();
            if (hora.length === 1)
                hora = '0' + hora;
            min = fecha.getMinutes().toString();
            if (min.length === 1)
                min = '0' + min;
            return dia + '/' + mes + '/' + año + ' ' + hora + ':' + min;
        }

        function limpiarCampos() {
            $state.reload();
        }

        function exportarExcel() {
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Nro Caravana';
            filtro.Titulos[1] = 'Tipo Evento';
            filtro.Titulos[2] = 'Fecha Desde';
            filtro.Titulos[3] = 'Fecha Hasta';

            var titulos = [];
            titulos[0] = "Tipo de Evento";
            titulos[1] = "Fecha Evento";
            titulos[2] = "Bovinos que participaron";

            var propiedades = [];
            propiedades[0] = "tipoEvento";
            propiedades[1] = "fechaHora";
            propiedades[2] = "cantidadBovinos";

            if (vm.rowCollection.length > 0) {
                var i = 1;
                if (vm.filtro.numCaravana === undefined)
                    filtro[0] = '';
                else
                    vm.filtro[0] = vm.filtro.numCaravana;
                for (var property in vm.filtro) {
                    var type = typeof vm.filtro[property];
                    if ((vm.filtro[property] === null || type !== "object") && property !== "$resolved" && type !== "function" && type !== "numCaravana") {
                        if (property === "idTipoEvento") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.Eventos.length; j++) {
                                    if (vm.filtro[property] === vm.Eventos[j].idTipoEvento || parseInt(vm.filtro[property]) === vm.Eventos[j].idTipoEvento) {
                                        filtro[i] = vm.Eventos[j].descripcion;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "fechaDesde") {
                            if (vm.filtro[property] === '2') {
                                filtro[i] = '';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Hembra';
                                i += 1;
                            }
                        }
                        else if (property === "fechaHasta") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                        }
                        else if (property === "numCaravana") {
                            filtro[0] = $scope.filtro[property];
                        }
                        else {
                            filtro[i] = $scope.filtro[property];
                            i += 1;
                        }
                    }
                }
                if (vm.filtro.fechaDesde === undefined)
                    filtro[filtro.length] = '';
                if (vm.filtro.fechaHasta === undefined)
                    filtro[filtro.length] = '';
                var fecha = new Date();
                fecha = convertirFecha(fecha);
                for (var i = 0; i < vm.rowCollection.length; i++) {
                    if (vm.rowCollection[i].$$hashKey === undefined)
                        vm.rowCollection[i].$$hashKey = '';
                }
                exportador.exportarExcel('Trazabilidad' + fecha, vm.rowCollection, titulos, filtro, propiedades, 'Trazabilidad', function () {
                    toastr.success("Se ha exportado con Éxito.", "EXITOSO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function exportarPDF() {
            var filtro = [];
            filtro.Titulos = [];
            filtro.Titulos[0] = 'Nro Caravana';
            filtro.Titulos[1] = 'Tipo Evento';
            filtro.Titulos[2] = 'Fecha Desde';
            filtro.Titulos[3] = 'Fecha Hasta';

            var propiedades = [];
            propiedades[0] = "tipoEvento";
            propiedades[1] = "fechaHora";
            propiedades[2] = "cantidadBovinos";

            if (vm.rowCollection.length > 0) {
                var i = 1;
                if (vm.filtro.numCaravana === undefined)
                    filtro[0] = '';
                else
                    filtro[0] = vm.filtro.numCaravana;
                for (var property in vm.filtro) {
                    var type = typeof vm.filtro[property];
                    if ((vm.filtro[property] === null || type !== "object") && property !== "$resolved" && type !== "function" && property !== "numCaravana") {
                        if (property === "idTipoEvento") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                            else {
                                for (var j = 0; j < vm.Eventos.length; j++) {
                                    if (vm.filtro[property] === vm.Eventos[j].idTipoEvento || parseInt(vm.filtro[property]) === vm.Eventos[j].idTipoEvento) {
                                        filtro[i] = vm.Eventos[j].descripcion;
                                        i += 1;
                                        break;
                                    }
                                }
                            }
                        }
                        else if (property === "fechaDesde") {
                            if (vm.filtro[property] === '2') {
                                filtro[i] = '';
                                i += 1;
                            }
                            else {
                                filtro[i] = 'Hembra';
                                i += 1;
                            }
                        }
                        else if (property === "fechaHasta") {
                            if (vm.filtro[property] === '0') {
                                filtro[i] = 'Seleccione';
                                i += 1;
                            }
                        }
                        else {
                            filtro[i] = $scope.filtro[property];
                            i += 1;
                        }
                    }
                }
                if (vm.filtro.fechaDesde === undefined)
                    filtro[filtro.length] = '';
                if (vm.filtro.fechaHasta === undefined)
                    filtro[filtro.length] = '';
                var fecha = new Date();
                fecha = convertirFecha(fecha);
                var tab_text = '<html><head></head><body>';
                tab_text += "<h1 style='align:center;'>Trazabilidad</h1>";
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
                $html += "<td style='width:1000; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Tipo de Evento</font></b></td>";
                $html += "<td style='width:1000; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Fecha Evento</font></b></td>";
                $html += "<td style='width:1000; height:50px; text-align:center; vertical-align:center;' bgcolor='black'><b><font color='white'>Bovinos que participaron</font></b></td>";
                $html += "</tr></thead><tbody>";
                var $body = "<tr>";
                for (var i = 0; i < vm.rowCollection.length; i++) {
                    if (vm.rowCollection[i].$$hashKey === undefined)
                        vm.rowCollection[i].$$hashKey = '';
                }
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

                exportador.exportarPDF('Trazabilidad' + fecha, tab_text, function () {
                    toastr.success("Se ha exportado con Éxito.", "ÉXITO");
                }, function (error) {
                    vm.showSpinner = false;
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }
        }

        function openPopUp(tipoEvento, fecha, idEvento) {
            vm.tipoEventoPopUp = tipoEvento;
            vm.fecha = fecha;
            idEventoAEliminar = idEvento;
            $('#modalConfirmEliminar').modal('show');
        }

        function eliminar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            consultarTrazabilidadService.eliminarEvento(idEventoAEliminar).then(function success() {
                $('#modalConfirmEliminar').modal('hide');
                toastr.success('Evento eliminado con éxito', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                //vm.showSpinner = false;
                $state.reload();
            }, function (error) {
                $('#modalConfirmEliminar').modal('hide');
                $scope.$parent.unBlockSpinnerSave();
                //vm.showSpinner = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function ordenarFechasMenorAMayor(lista) {
            var listaARetornar = [];
            for (var i = lista.length - 1; i >= 0; i--) {
                listaARetornar.push(lista[i]);
            }
            /*var fechaInicial, fechaSgte, aux;
            for (var i = lista.length - 1; i > 0 ; i--) {
                fechaInicial = new Date(lista[i].fechaHora.substring(6, 10), parseInt(lista[i].fechaHora.substring(3, 5)) - 1, lista[i].fechaHora.substring(0, 2));
                for (var j = i - 1; j > 0; j--) {
                    fechaSgte = new Date(lista[j].fechaHora.substring(6, 10), parseInt(lista[j].fechaHora.substring(3, 5)) - 1, lista[j].fechaHora.substring(0, 2));
                    if (fechaSgte < fechaInicial) {
                        aux = lista[i];
                        lista[i] = lista[j];
                        lista[j] = aux;
                        fechaInicial = new Date(lista[i].fechaHora.substring(6, 10), parseInt(lista[i].fechaHora.substring(3, 5)) - 1, lista[i].fechaHora.substring(0, 2));
                    }
                    else if (fechaSgte <= fechaInicial) {
                        aux = lista[i + 1];
                        lista[i + 1] = lista[j];
                        lista[j] = aux;
                    }
                }
            }*/
            return listaARetornar;
        }

        function cargarLineaTiempoEventos() {
            var list = ordenarFechasMenorAMayor(vm.rowCollection);
            google.charts.load('current', { 'packages': ['timeline'] });
            google.charts.setOnLoadCallback(drawChart);
            function drawChart() {
                var container = document.getElementById('timeline');
                var chart = new google.visualization.Timeline(container);
                var dataTable = new google.visualization.DataTable();

                dataTable.addColumn({ type: 'string', id: 'Evento' });
                dataTable.addColumn({ type: 'date', id: 'Start' });
                dataTable.addColumn({ type: 'date', id: 'End' });
                var fechaSiguiente, horaSiguiente;
                for (var i = 0; i < list.length; i++) {
                    var fechaAnterior = list[i].fechaHora.substring(0, 10).split('/');
                    var horaAnterior = list[i].fechaHora.substring(11, 16).split(':');
                    switch (list[i].tipoEvento) {
                        case 'Vacunación':
                        case 'Antibiótico':
                            fechaSiguiente = new Date(fechaAnterior[2], parseInt(fechaAnterior[1]) - 1, fechaAnterior[0], horaAnterior[0], horaAnterior[1]);
                            fechaSiguiente.setDate(fechaSiguiente.getDate() + 1);                            
                            fechaSiguiente = convertirFecha(fechaSiguiente);
                            horaSiguiente = fechaSiguiente.substring(11, 16).split(':');
                            fechaSiguiente = fechaSiguiente.substring(0, 10).split('/');
                            break;
                        case 'Manejo':
                            idManejo.push(list[i].idEvento);
                            var index = list.findIndex(encontrarManejo);
                            if (index !== -1) {
                                fechaSiguiente = list[index].fechaHora.substring(0, 10).split('/');
                                horaSiguiente = list[index].fechaHora.substring(11, 16).split(':');
                            }
                            else {
                                fechaSiguiente = convertirFecha(new Date());
                                horaSiguiente = fechaSiguiente.substring(11, 16).split(':');
                                fechaSiguiente = fechaSiguiente.substring(0, 10).split('/');
                            }
                            break;
                        case 'Alimenticio':
                            idAlimenticio.push(list[i].idEvento);
                            var index = list.findIndex(encontrarAlimenticio);
                            if (index !== -1){
                                fechaSiguiente = list[index].fechaHora.substring(0, 10).split('/');
                                horaSiguiente = list[index].fechaHora.substring(11, 16).split(':');
                            }
                            else {
                                fechaSiguiente = convertirFecha(new Date());
                                horaSiguiente = fechaSiguiente.substring(11, 16).split(':');
                                fechaSiguiente = fechaSiguiente.substring(0, 10).split('/');
                            }
                            break;
                    }
                    dataTable.addRows([
                  [list[i].tipoEvento, new Date(fechaAnterior[2], parseInt(fechaAnterior[1]) - 1, fechaAnterior[0], horaAnterior[0], horaAnterior[1]), new Date(fechaSiguiente[2], parseInt(fechaSiguiente[1]) - 1, fechaSiguiente[0], horaSiguiente[0], horaSiguiente[1])]]);
                }
                chart.draw(dataTable);
            }
        }

        function encontrarManejo(evento) {
            return evento.tipoEvento === 'Manejo' && idManejo.indexOf(evento.idEvento) === -1;
        }
        
        function encontrarAlimenticio(evento) {
            return evento.tipoEvento === 'Alimenticio' && idAlimenticio.indexOf(evento.idEvento) === -1;
        }

        function getFechaDesde() {
            vm.filtro.fechaDesde = $('#datetimepicker4')[0].value;
            var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
            var fechaMin = new Date(2000, 1, 1);
            if (fechaDesde < fechaMin) {
                vm.formConsultarTrazabilidad.fechaDesde.$setValidity("min", false);
            }
            else {
                vm.formConsultarTrazabilidad.fechaDesde.$setValidity("min", true);
            }
        }

        function getFechaHasta() {
            vm.filtro.fechaHasta = $('#datetimepicker5')[0].value;
            if (vm.filtro.fechaDesde !== undefined) {
                var fechaHasta = new Date(vm.filtro.fechaHasta.substring(6, 10), parseInt(vm.filtro.fechaHasta.substring(3, 5)) - 1, vm.filtro.fechaHasta.substring(0, 2));
                var fechaDesde = new Date(vm.filtro.fechaDesde.substring(6, 10), parseInt(vm.filtro.fechaDesde.substring(3, 5)) - 1, vm.filtro.fechaDesde.substring(0, 2));
                if (fechaHasta < fechaDesde) {
                    vm.formConsultarTrazabilidad.fechaHasta.$setValidity("min", false);
                }
                else {
                    vm.formConsultarTrazabilidad.fechaHasta.$setValidity("min", true);
                }
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('detalleEventoService', detalleEventoService);

    detalleEventoService.$inject = ['$http', 'portalService'];

    function detalleEventoService($http, portalService) {
        var service = {
            getEvento: getEvento
        };

        function getEvento(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/Get',
                params: { idEvento: id },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleEventoController', detalleEventoController);

    detalleEventoController.$inject = ['$scope', 'detalleEventoService', '$stateParams', 'toastr'];

    function detalleEventoController($scope, detalleEventoService, $stateParams, toastr) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.disabled = true;
        //funciones
        vm.inicializar = inicializar();
        //variables
        vm.evento = {};

        function inicializar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.disabled = true;
            vm.itemsPorPagina = 9;
            vm.idEvento = $stateParams.id;
            detalleEventoService.getEvento($stateParams.id).then(function success(data) {
                //evento
                vm.evento = data;
                vm.rowCollection = vm.evento.listaBovinos;
                vm.disabled = false;
                //seteamos a "" las variables 0
                angular.forEach(vm.evento, function (value, key) {
                    if (parseInt(value) === 0 && key !== 'idEvento') {
                        vm.evento[key] = '';
                    }
                });
                $scope.$parent.unBlockSpinner();
                //vm.showSpinner = false;
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }//fin inicializar


    }//fin archivo
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('modificarEventoService', modificarEventoService);

    modificarEventoService.$inject = ['$http', 'portalService'];

    function modificarEventoService($http, portalService) {
        var service = {
            getEventoForModificar: getEventoForModificar,
            initModificacion: initModificacion,
            modificar: modificar,
            getRodeos: getRodeos
        };

        function getEventoForModificar(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/GetEventoForModificacion',
                params: { idEvento: id },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function initModificacion(id, usuario, codigoCampo, idRol) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/initEvento',
                params: {
                    idEvento: id,
                    usuario: usuario,
                    idCampo: codigoCampo,
                    idRol : idRol
                },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function modificar(evento, lista) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Evento',
                params: { value: evento, lista: lista },
                headers: portalService.getHeadersServer()
            })
        }

        function getRodeos(campo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Rodeo/GetList',
                params: {
                    campo: campo
                },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarEventoController', modificarEventoController);

    modificarEventoController.$inject = ['$scope', 'modificarEventoService', '$stateParams', 'tipoEventoService', 'toastr', '$localStorage', '$sessionStorage'];

    function modificarEventoController($scope, modificarEventoService, $stateParams, tipoEventoService, toastr, $localStorage, $sessionStorage) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.habilitar = false;
        vm.habilitarBtnAceptar = false;
        vm.showBotones = true;
        //funciones
        vm.inicializar = inicializar();
        vm.modificar = modificar;
        vm.eliminar = eliminar;
        vm.openPopUp = openPopUp;
        vm.changeCampos = changeCampos;
        vm.changeRodeos = changeRodeos;
        vm.getFecha = getFecha;
        vm.modificarEvento = modificarEvento;
        //variables
        vm.evento = {};
        vm.fechaDeHoy = new Date();
        $('#datetimepicker4').datetimepicker();
        var idBovinoEliminar = 0;

        function inicializar() {
            vm.showBotones = true;
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.habilitar = false;
            vm.habilitarBtnAceptar = false;
            vm.itemsPorPagina = 9;
            vm.idEvento = $stateParams.id;
            modificarEventoService.initModificacion($stateParams.id, $sessionStorage.usuarioInfo.usuario, $localStorage.usuarioInfo.codigoCampo, $sessionStorage.usuarioInfo.idRol).then(function success(data) {
                vm.vacunas = data.vacunas;
                vm.alimentos = data.alimentos;
                vm.antibioticos = data.antibioticos;
                vm.tiposEventos = data.tipoEvento;
                vm.rowCollection = data.listaBovinos.listaBovinos;
                vm.campos = data.campos;
                vm.rodeos = data.rodeos;
                modificarEventoService.getEventoForModificar($stateParams.id).then(function success(data) {
                    //evento
                    vm.evento = data;
                    vm.evento.idTipoEvento = vm.evento.idTipoEvento.toString();
                    vm.evento.idVacuna = vm.evento.idVacuna.toString();
                    vm.evento.idAlimento = vm.evento.idAlimento.toString();
                    vm.evento.idAntibiotico = vm.evento.idAntibiotico.toString();
                    vm.evento.idCampoDestino = vm.evento.idCampoDestino.toString();
                    vm.idRodeoDestino = vm.evento.idRodeoDestino.toString();
                    if (vm.evento.idCampoDestino !== "0") {
                        vm.changeCampos();
                    }
                    angular.forEach(vm.evento, function (value, key) {
                        if (parseInt(value) === 0 && key !== 'idEvento') {
                            vm.evento[key] = '';
                        }
                    });
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                    vm.habilitar = true;
                    vm.habilitarBtnAceptar = true;
                }, function error(error) {
                    //vm.showSpinner = false;
                    $scope.$parent.unBlockSpinner();
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
                });
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        }//fin inicializar

        function modificar() {
            getFecha();
            if (vm.evento.cantidad === '')
                vm.evento.cantidad = 0;
            else
                vm.evento.cantidad = vm.evento.cantidad.toString().replace(',', '.');
            vm.evento.fechaHora = vm.evento.fechaHora.substring(6, 10) + '/' + vm.evento.fechaHora.substring(3, 5) + '/' + vm.evento.fechaHora.substring(0, 2) + ' ' + convertirHora(vm.evento.fechaHora.substring(11, 16), vm.evento.fechaHora.substring(17, 19));
            //vm.evento.fechaHora = convertirFecha(vm.evento.fechaHora);
            if (vm.evento.idVacuna === '')
                vm.evento.idVacuna = 0;
            if (vm.evento.idAntibiotico === '')
                vm.evento.idAntibiotico = 0;
            if (vm.evento.idCampoDestino === '')
                vm.evento.idCampoDestino = 0;
            if (vm.evento.idRodeoDestino === '')
                vm.evento.idRodeoDestino = 0;
            if (vm.evento.idAlimento === '')
                vm.evento.idAlimento = 0;
            vm.evento.idRodeoDestino = vm.idRodeoDestino;
            var ids = [];
            for (var i = 0; i < vm.rowCollection.length; i++) {
                ids.push(vm.rowCollection[i].idBovino);
            }
            if (ids.length === 0) {
                openPopUpConfirmElimEvento();
            }
            else {
                $scope.$parent.blockSpinnerSave();
                modificarEvento(ids);
            }                
        }

        function modificarEvento(ids) {
            modificarEventoService.modificar(vm.evento, ids.toString()).then(function success(data) {
                vm.habilitar = false;
                vm.showBotones = false;
                vm.habilitarBtnAceptar = false;
                toastr.success('Se modificó el evento con éxito ', 'Éxito');
                $('#modalConfirmEliminEvento').modal('hide');
                $scope.$parent.unBlockSpinnerSave();

            }, function error(data) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                toastr.error('La operación no se pudo completar', 'Error');
                $('#modalConfirmEliminEvento').modal('hide');
            })
        }

        function openPopUp(id, caravana) {
            idBovinoEliminar = id;
            vm.nroCaravana = caravana;
            $('#modalConfirmEliminar').modal('show');
        }

        function openPopUpConfirmElimEvento() {
            $('#modalConfirmEliminEvento').modal('show');
        }

        function eliminar() {
            for (var i = 0; i < vm.rowCollection.length; i++) {
                if (vm.rowCollection[i].idBovino === idBovinoEliminar)
                    vm.rowCollection.splice(i, 1);
            }
            $('#modalConfirmEliminar').modal('hide');
        }

        function convertirHora(hora, momento) {
            var horaDevuelta = hora;
            if (momento === 'pm') {
                switch (hora.substring(0, 2)) {
                    case '01':
                        horaDevuelta = '13' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '02':
                        horaDevuelta = '14' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '03':
                        horaDevuelta = '15' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '04':
                        horaDevuelta = '16' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '05':
                        horaDevuelta = '17' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '06':
                        horaDevuelta = '18' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '07':
                        horaDevuelta = '19' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '08':
                        horaDevuelta = '20' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '09':
                        horaDevuelta = '21' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '10':
                        horaDevuelta = '22' + ':' + horaDevuelta.substring(3, 5);
                        break;
                    case '11':
                        horaDevuelta = '23' + ':' + horaDevuelta.substring(3, 5);
                        break;
                }                
            }
            return horaDevuelta;
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
            return dia + '/' + mes + '/' + año + fecha.substring(12, 15);
        };

        function changeCampos() {
            var campo = '';
            vm.idRodeoDestino = vm.evento.idRodeoDestino.toString();
            for (var i = 0; i < vm.campos.length; i++) {
                if (vm.campos[i].idCampo === parseInt(vm.evento.idCampoDestino)) {
                    campo = vm.campos[i].codigoCampo;
                    break;
                }
            }
            $scope.$parent.blockSpinner();
            modificarEventoService.getRodeos(campo).then(function success(data) {
                vm.rodeos = data;
                var encontre = false;
                vm.habilitarBtnAceptar = true;
                for (var i = 0; i < vm.rodeos.length; i++) {
                    if (vm.rodeos[i].idRodeo === parseInt(vm.idRodeoDestino)) {
                        encontre = true;
                        break;
                    }
                }
                if (!encontre) {
                    vm.idRodeoDestino = '';
                    vm.habilitarBtnAceptar = false;
                }
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function changeRodeos() {
            if (parseInt(vm.evento.idRodeoDestino) > 0)
                vm.habilitarBtnAceptar = true;
        }

        function getFecha() {
            vm.evento.fechaHora = $('#datetimepicker4')[0].value;
            var fechaEvento = new Date(vm.evento.fechaHora.substring(6, 10), parseInt(vm.evento.fechaHora.substring(3, 5)) - 1, vm.evento.fechaHora.substring(0, 2));
            var fechaHoy = new Date();
            if (fechaEvento > fechaHoy) {
                vm.formModificarEvento.fechaEvento.$setValidity("max", false);
                vm.habilitarBtnAceptar = false;
            }
            else {
                vm.formModificarEvento.fechaEvento.$setValidity("max", true);
                vm.habilitarBtnAceptar = true;
            }            
        }
    }//fin archivo
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('consultarUsuariosService', consultarUsuariosService);

    consultarUsuariosService.$inject = ['$http', 'portalService'];

    function consultarUsuariosService($http, portalService) {
        var service = {
            inicializar: inicializar,
            obtenerListaUsuarios: obtenerListaUsuarios,
            darBajaUser: darBajaUser,
            activarUser: activarUser,
            validarCantidadUsuariosPlan: validarCantidadUsuariosPlan
        };

        function inicializar() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/Init',
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function obtenerListaUsuarios(filtro) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/GetList',
                params: { filter: filtro },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function darBajaUser(idUsuario) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Usuario/DarBaja',
                params: { idUsuario: idUsuario },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function activarUser(idUsuario) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Usuario/Activar',
                params: { idUsuario: idUsuario },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        function validarCantidadUsuariosPlan(usuario) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/ValidarCantUsuarios',
                params: { usuario: usuario },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('consultarUsuariosController', consultarUsuariosController);

    consultarUsuariosController.$inject = ['$scope', 'consultarUsuariosService', 'toastr', 'exportador', '$localStorage', '$state', '$sessionStorage'];

    function consultarUsuariosController($scope, consultarUsuariosService, toastr, exportador, $localStorage, $state, $sessionStorage) {
        var vm = $scope;
        window.scrollTo(0, 0);
        vm.deshabilitar = false;
        vm.disabledExportar = 'disabled';
        var idUsuarioEliminar = 0;
        var idUsuarioActivar = 0;
        //variables
        vm.usuarios = [];
        vm.filtro = {};

        //funciones
        vm.inicializar = inicializar();
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.exportarExcel = exportarExcel;
        vm.exportarPDF = exportarPDF;
        vm.openPopUp = openPopUp;
        vm.openPopUpActivar = openPopUpActivar;
        vm.eliminar = eliminar;
        vm.activar = activar;
        vm.validarCantUsuarios = validarCantUsuarios;

        function inicializar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.deshabilitar = true;
            vm.disabledExportar = 'disabled';
            vm.itemsPorPagina = 9;
            consultarUsuariosService.inicializar().then(function success(data) {
                vm.roles = data.roles;
                vm.filtro.idRol = '0';
                consultar();
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        };

        function consultar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
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
                $scope.$parent.unBlockSpinner();
                //vm.showSpinner = false;                
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
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

        function openPopUp(usuario) {
            vm.usuario = usuario.usuario;
            idUsuarioEliminar = usuario.idUsuario;
            $('#modalConfirmEliminacionUser').modal('show');
        }

        function eliminar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            consultarUsuariosService.darBajaUser(idUsuarioEliminar).then(function success() {
                $('#modalConfirmEliminacionUser').modal('hide');
                toastr.success('Se ha dado de baja al usuario con éxito', 'Éxito');
                $scope.$parent.unBlockSpinnerSave();
                //vm.showSpinner = false;
                $state.reload();
            }, function (error) {
                $('#modalConfirmEliminacionUser').modal('hide');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function openPopUpActivar(usuario) {
            vm.usuarioActivo = usuario.usuario;
            idUsuarioActivar = usuario.idUsuario;
            $('#modalConfirmActivacionUser').modal('show');
        }

        function activar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            consultarUsuariosService.activarUser(idUsuarioActivar).then(function success() {
                $('#modalConfirmActivacionUser').modal('hide');
                toastr.success('Se ha activado al usuario con éxito', 'Éxito');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                $state.reload();
            }, function (error) {
                $('#modalConfirmActivacionUser').modal('hide');
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }

        function validarCantUsuarios() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinner();
            consultarUsuariosService.validarCantidadUsuariosPlan($sessionStorage.usuarioInfo.usuario).then(function success(data) {
                if (data.resultado)
                    $state.go('home.registrarUsuario');
                else {
                    toastr.info("No puede agregar mas usuarios, verifique su plan contratado.", "Aviso");
                    $scope.$parent.unBlockSpinner();
                }                              
            }, function (error) {
                $scope.$parent.unBlockSpinner();
                toastr.error("Se ha producido un error, reintentar.");
            })
        };

    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .factory('detalleUsuariosService', detalleUsuariosService);

    detalleUsuariosService.$inject = ['$http', 'portalService'];

    function detalleUsuariosService($http, portalService) {
        var service = {
            getUsuario: getUsuario
        };

        function getUsuario(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/GetDetalle',
                params: { idUsuario: id },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('detalleUsuariosController', detalleUsuariosController);

    detalleUsuariosController.$inject = ['$scope', 'detalleUsuariosService', '$stateParams', 'toastr'];

    function detalleUsuariosController($scope, detalleUsuariosService, $stateParams, toastr) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        //metodos
        vm.inicializar = inicializar;
        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            detalleUsuariosService.getUsuario($stateParams.id).then(function success(data) {
                vm.usuario = data;
                $scope.$parent.unBlockSpinner();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('app')
        .factory('modificarUsuariosService', modificarUsuariosService);

    modificarUsuariosService.$inject = ['$http', 'portalService'];

    function modificarUsuariosService($http, portalService) {
        var service = {
            getUsuario: getUsuario,
            modificar: modificar
        };

        function getUsuario(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Usuario/Get',
                params: { idUsuario: id },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function modificar(usuario) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Usuario',
                params: { usuario: usuario },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }   


        return service;
    }
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('modificarUsuariosController', modificarUsuariosController);

    modificarUsuariosController.$inject = ['$scope', '$stateParams', 'modificarUsuariosService', 'toastr'];

    function modificarUsuariosController($scope, $stateParams, modificarUsuariosService, toastr) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        //metodos
        vm.inicializar = inicializar;
        vm.modificar = modificar;
        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.roles = [];
            //vm.roles.push({ idRol: 1, nombre: 'Dueño' });
            vm.roles.push({ idRol: 2, nombre: 'Ingeniero' });
            vm.roles.push({ idRol: 3, nombre: 'Peón' });
            modificarUsuariosService.getUsuario($stateParams.id).then(function success(data){
                vm.usuario = data;
                vm.usuario.idRol = vm.usuario.idRol.toString();
                $scope.$parent.unBlockSpinner();
                //vm.showSpinner = false;
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinner();
                vm.habilitar = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })            
        }

        function modificar() {
            //vm.showSpinner = true;
            $scope.$parent.blockSpinnerSave();
            modificarUsuariosService.modificar(vm.usuario).then(function success(data) {
                vm.habilitar = false;
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                toastr.success('Se modificó el usuario con éxito ', 'Éxito');
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                vm.habilitar = false;
                toastr.error('Ha ocurrido un error, reintentar', 'Error');
            })            
        }
    }
})();

(function () {
    angular.module('app')
        .factory('registrarUsuariosService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Usuario/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Usuario/Init',
                    headers: portalService.getHeadersServer(),
                    isArray: false
                },
                save: {
                    method: 'POST',
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("usuario", angular.toJson(data));
                        if (data.imagen) {
                            formData.append("file" + 0, data.imagen);
                        }
                        return formData;
                    },
                    headers: portalService.getContentUndefined()
                },
                validarCantCamposUsuario: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Campo/validarCantCamposXUsuario',
                    params: {
                        usuario: '@usuario'
                    },
                    headers: portalService.getHeadersServer(),
                    isArray: false
                }
            });
        });
})();
(function () {
    'use strict';

    angular
        .module('app')
        .controller('registrarUsuariosController', registrarUsuariosController);

    registrarUsuariosController.$inject = ['$scope', 'registrarUsuariosService', '$localStorage', 'toastr'];

    function registrarUsuariosController($scope, registrarUsuariosService, $localStorage, toastr) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        vm.btnVolver = "Cancelar";
        vm.habilitar = true;
        vm.imageToUpload = [];
        vm.toDelete = [];

        //metodos
        vm.inicializar = inicializar;
        vm.registrar = registrar;
        vm.validarContrasenias = validarContrasenias;
        vm.selectUnselectImage = selectUnselectImage;
        vm.ImageClass = ImageClass;
        vm.deleteImagefromModel = deleteImagefromModel;
        vm.UploadImg = UploadImg;
        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.usuario = new registrarUsuariosService();
            //vm.showSpinner = false;
            vm.roles = [];
            vm.roles.push({ idRol: 2, nombre: 'Ingeniero' });
            vm.roles.push({ idRol: 3, nombre: 'Peón' });
            $scope.$parent.unBlockSpinner();
        };

        function registrar() {
            $scope.$parent.blockSpinnerSave();
            vm.habilitar = false;
            if (vm.imageToUpload[0])
                vm.usuario.imagen = vm.imageToUpload[0];
            vm.usuario.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            vm.usuario.$save(function (data) {
                toastr.success('Se agrego con éxito el usuario ', 'Éxito');
                vm.btnVolver = "Volver";
                $scope.$parent.unBlockSpinnerSave();
                //vm.showSpinner = false;
            }, function error(error) {
                //vm.showSpinner = false;
                $scope.$parent.unBlockSpinnerSave();
                if (error.data === 'Error: El usuario ya existe para este campo') {
                    vm.habilitar = true;
                    toastr.warning('El usuario ya existe para este campo', 'Advertencia')
                }
                else
                    toastr.error('Ha ocurrido un error, reintentar', 'Error');
            });
        };

        function validarContrasenias() {
            if (vm.usuario.pass === vm.contraseniaRepetida.contraseniaRepetida) {
                vm.formRegistrarUsuario.contraseniaRepetida.$setValidity("min", true);
            }
            else {
                vm.formRegistrarUsuario.contraseniaRepetida.$setValidity("min", false);
            }
        };

        function selectUnselectImage(item) {
            var index = vm.toDelete.indexOf(item);
            if (index != -1) {
                vm.toDelete.splice(index, 1);
            } else {
                $scope.toDelete.push(item)
            }
        };

        function ImageClass(item) {
            var index = vm.toDelete.indexOf(item);
            if (index != -1) {
                return true;
            } else {
                return false;
            }
        };

        function deleteImagefromModel() {
            if (vm.toDelete != [] && vm.toDelete.length > 0) {
                angular.forEach($scope.toDelete, function (value, key) {
                    var index = vm.imageToUpload.indexOf(value);
                    var indexToDelete = vm.toDelete.indexOf(value);
                    if (index != -1) {
                        vm.imageToUpload.splice(index, 1);
                        vm.toDelete.splice(indexToDelete, 1);
                    }
                });
            }
            else {
                toastr.info('Debe seleccionar una imágen para borrar', 'Aviso');
            }
        };

        function UploadImg($files, $invalidFiles) {
            $scope.imageToUpload = $files
        };
    }
})();

(function () {
    'use strict';

    angular.module('app').config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/login");

        /// Default
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'loginController'
            });
        $stateProvider
            .state('seleccionCampo', {
                url: '/login/seleccion-campo',
                templateUrl: 'app/seleccion-campo/seleccion-campo.html',
                controller: 'seleccionCampoController'
            });
        $stateProvider
            .state('registrarCampo', {
                url: '/registrarCampo',
                templateUrl: 'app/campo/registrar-campo.html',
                controller: 'registrarCampoController'
            });
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/master.html',
                controller: 'homeController',
                data: {
                    pageTitle: 'Farmix - Home',
                    bodyClass: 'master'
                }
            });
        $stateProvider
             .state('home.inicio', {
                 url: '/inicio',
                 templateUrl: 'app/inicio/inicio.html',
                 controller: 'inicioController',
                 data: {
                     pageTitle: 'Farmix - Inicio'
                 }
             });
        $stateProvider
             .state('home.cerrarSesion', {
                 url: '/cerrarSesion',
                 templateUrl: '',
                 controller: ''
             });
        $stateProvider
             .state('home.reportes', {
                 url: '/reportes',
                 templateUrl: 'app/reportes/consultar-reportes.html',
                 controller: 'consultarReportesController'
             });
        $stateProvider
             .state('home.reporteBovino', {
                 url: '/reportes/bovinos',
                 templateUrl: 'app/reportes/reporte-bovino/reporte-bovino.html',
                 controller: 'reporteBovinoController'
             });
        $stateProvider
             .state('home.reporteInseminacion', {
                 url: '/reportes/inseminaciones',
                 templateUrl: 'app/reportes/reporte-inseminacion/reporte-inseminacion.html',
                 controller: 'reporteInseminacionController'
             });
        $stateProvider
            .state('home.conflictos', {
                url: '/conflictos',
                templateUrl: 'app/conflicto/consultar-conflicto/consultar-conflicto.html',
                controller: 'consultarConflictoController'
            })
        //$stateProvider
            .state('home.resolverConflicto', {
                url: '/conflicto/resolver',
                params: { 'idTacto': null, 'fechaTacto': null, 'idTactoConfl': null, 'fechaTactoConfl': null, 'idInseminacion': null, 'idInseminConfl': null },
                templateUrl: 'app/conflicto/resolver-conflicto/resolver-conflicto.html',
                controller: 'resolverConflictoController'
            });
        $stateProvider
            .state('home.bovino', {
                url: '/bovino',
                templateUrl: 'app/bovino/consultar-bovino/consultar-bovino.html',
                controller: 'consultarBovinoController',
                data: {
                    pageTitle: 'Farmix - Consulta de Bovinos'
                }
            })
        //$stateProvider
            .state('home.registrarBovino', {
                url: '/bovino/registrar',
                templateUrl: 'app/bovino/registrar-bovino/registrar-bovino.html',
                controller: 'registrarBovinoController',
                data: {
                    pageTitle: 'Farmix - Registrar Bovino'
                }
            })
        //$stateProvider
            .state('home.detalleBovino', {
                url: '/bovino/detalle',
                params: { 'id': null, 'evento': null, 'proviene': null, 'fecha': null, 'desde': null },
                templateUrl: 'app/bovino/detalle-bovino/detalle-bovino.html',
                controller: 'detalleBovinoController',
                data: {
                    pageTitle: 'Farmix - Detalle de Bovino'
                }
            })
        //$stateProvider
            .state('home.modificarBovino', {
                url: '/bovino/modificacion',
                params: { 'id': null },
                templateUrl: 'app/bovino/modificar-bovino/modificar-bovino.html',
                controller: 'modificarBovinoController',
                data: {
                    pageTitle: 'Farmix - Modificación de Bovino'
                }
            })
        //$stateProvider
            .state('home.eliminarBovino', {
                url: '/bovino/darDeBaja',
                params: { 'id': null },
                templateUrl: 'app/bovino/eliminar-bovino/eliminar-bovino.html',
                controller: 'eliminarBovinoController'
            });
        $stateProvider
            .state('home.trazabilidad', {
                url: '/trazabilidad',
                templateUrl: 'app/trazabilidad/consultar-trazabilidad/consultar-trazabilidad.html',
                controller: 'consultarTrazabilidadController',
                data: {
                    pageTitle: 'Farmix - Consulta Trazabilidad'
                }
            })
            .state('home.detalleEvento', {
                url: '/evento/detalle',
                params: { 'id': null },
                templateUrl: 'app/trazabilidad/detalle-evento/detalle-evento.html',
                controller: 'detalleEventoController'
            })
            .state('home.modificarEvento', {
                url: '/evento/modificar',
                params: { 'id': null },
                templateUrl: 'app/trazabilidad/modificar-evento/modificar-evento.html',
                controller: 'modificarEventoController'
            });
        $stateProvider
            .state('home.inseminacion', {
                url: '/inseminacion',
                templateUrl: 'app/inseminacion/consultar-inseminacion/consultar-inseminacion.html',
                controller: 'consultarInseminacionController'
            })
            .state('home.modificarInseminacion', {
                url: '/inseminacion/modificar',
                params: { 'fecha': null, 'desde': null },
                templateUrl: 'app/inseminacion/modificar-inseminacion/modificar-inseminacion.html',
                controller: 'modificarInseminacionController'
            })
            .state('home.detalleInseminacion', {
                url: '/inseminacion/detalle',
                params: { 'fecha': null, 'desde': null },
                templateUrl: 'app/inseminacion/detalle-inseminacion/detalle-inseminacion.html',
                controller: 'detalleInseminacionController'
            });
        $stateProvider
            .state('home.usuarios', {
                url: '/usuarios',
                templateUrl: 'app/usuarios/consultar-usuarios/consultar-usuarios.html',
                controller: 'consultarUsuariosController'
            })
            .state('home.modificarUsuario', {
                url: '/usuarios/modificacion',
                params: { 'id': null },
                templateUrl: 'app/usuarios/modificar-usuarios/modificar-usuarios.html',
                controller: 'modificarUsuariosController'
            })
            .state('home.detalleUsuario', {
                url: '/usuarios/detalle',
                params: { 'id': null },
                templateUrl: 'app/usuarios/detalle-usuarios/detalle-usuarios.html',
                controller: 'detalleUsuariosController'
            })
            .state('home.registrarUsuario', {
                url: '/usuarios/registro',
                templateUrl: 'app/usuarios/registrar-usuarios/registrar-usuarios.html',
                controller: 'registrarUsuariosController'
            });
        $stateProvider
            .state('home.configuracion', {
                url: '/configuracion',
                templateUrl: 'app/configuracion/configuracion.html',
                controller: 'configuracionController'
            })
    });
})();

//,
//controller: "loginController",
//resolve: {
//    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
//        return $ocLazyLoad.load([{
//            name: 'app',
//            insertBefore: '#ng_load_plugins_before',
//            files: [
//		 //'assets/pages/css/login.min.css',
//		 //'assets/global/plugins/jquery-validation/js/jquery.validate.min.js',
//		 //'assets/global/plugins/jquery-validation/js/additional-methods.min.js',
//		 //'assets/global/scripts/app.min.js',
//		 //'assets/pages/scripts/login.min.js',
//		 //'scripts/services/portal/login-service.js',
//		 //'scripts/controllers/portal/login-controller.js'
//            ]
//        }]);
//    }]
//}