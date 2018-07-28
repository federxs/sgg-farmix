(function () {
    'use strict';

    angular
        .module('app')
        .controller('reporteInseminacionController', reporteInseminacionController);

    reporteInseminacionController.$inject = ['$scope', 'reporteInseminacionService', '$stateParams', '$localStorage', '$state', 'toastr', 'portalService', '$sessionStorage', 'consultarBovinoService'];

    function reporteInseminacionController($scope, reporteInseminacionService, $stateParams, $localStorage, $state, toastr, portalService, $sessionStorage, consultarBovinoService) {
        var vm = $scope;
        //variables
        window.scrollTo(0, 0);
        $('[data-toggle="tooltip"]').tooltip();
        vm.fechaDeHoy = new Date();
        $('#datetimepicker4').datetimepicker();
        $('#datetimepicker5').datetimepicker();
        vm.itemsPorPagina = 50;
        vm.tablaActiva = $stateParams.tabla;
        vm.filtro = {};

        vm.exportarHembrasServicioPDF = exportarHembrasServicioPDF;
        vm.exportarServiciosSinConfirmarPDF = exportarServiciosSinConfirmarPDF;
        vm.exportarLactanciasPDF = exportarLactanciasPDF;
        vm.exportarPreniadasPDF = exportarPreniadasPDF;
        vm.exportarHembrasServicioExcel = exportarHembrasServicioExcel;
        vm.exportarServiciosSinConfirmarExcel = exportarServiciosSinConfirmarExcel;
        vm.exportarLactanciasExcel = exportarLactanciasExcel;
        vm.exportarPreniadasExcel = exportarPreniadasExcel;
        vm.consultar = consultar;
        vm.limpiarCampos = limpiarCampos;
        vm.getFechaInseminacion = getFechaInsemacion;
        vm.getFechaParto = getFechaParto;
        inicializar();

        function inicializar() {
            $scope.$parent.blockSpinner();
            vm.disabled = 'disabled';
            vm.disabledExportar = 'disabled';
            switch (vm.tablaActiva) {
                case 0:
                    vm.tituloFiltroCaravana = 'Permite buscar una hembra que esté lista para servir por su número de caravana.';                    
                    vm.tituloFiltroCategoria = 'Permite filtrar hembras que esten listas para servir según su categoría.';
                    vm.tituloFiltroEstado = 'Permite filtrar hembras que esten listas para servir por el estado en que se encuentran.';
                    vm.tituloFiltroRaza = 'Permite filtrar hembras que esten listas para servir que pertenecen a la raza seleccionada.';
                    vm.tituloLimpiarCampos = 'todas las hembras listas para servir';
                    vm.tituloBuscar = 'las hembras listas para servir';
                    vm.tituloFiltroAccionPartos = 'Permite filtrar las hembra que esten listas para servir por su nro de partos, “mayor” o “menor o igual” al valor ingresado.';
                    break;
                case 1:
                    vm.tituloFiltroCaravana = 'Permite buscar una vaca que este dando de lactar por su número de caravana.';                    
                    vm.tituloFiltroCategoria = 'Permite filtrar vacas que esten dando de lactar según su categoría.';
                    vm.tituloFiltroEstado = 'Permite filtrar vacas que esten dando de lactar por el estado en que se encuentran.';
                    vm.tituloFiltroRaza = 'Permite filtrar vacas que esten dando de lactar que pertenecen a la raza seleccionada.';
                    vm.tituloLimpiarCampos = 'todas las lactancias activas';
                    vm.tituloBuscar = 'las lactancias activas';
                    vm.tituloFiltroAccionPartos = 'Permite filtrar las lactancias activas por el nro de partos de la vaca que esta dando de lactar, “mayor” o “menor o igual” al valor ingresado.';
                    break;
                case 2:
                    vm.tituloFiltroCaravana = 'Permite buscar una vaca preñada por su número de caravana.';                    
                    vm.tituloFiltroFechaInseminacion = 'las Vacas preñadas que han sido inseminadas';
                    vm.tituloFiltroCategoria = 'Permite filtrar vacas preñadas según su categoría.';
                    vm.tituloFiltroEstado = 'Permite filtrar vacas preñadas por el estado en que se encuentran.';
                    vm.tituloFiltroRaza = 'Permite filtrar vacas que esten preñadas que pertenecen a la raza seleccionada.';
                    vm.tituloLimpiarCampos = 'todas las vacas preñadas';
                    vm.tituloBuscar = 'las vacas preñadas';
                    vm.tituloFiltroTipoInseminacion = 'Permite filtrar vacas preñadas cuyo tipo de inseminación pertenece al valor seleccionado.';
                    break;
                case 3:
                    vm.tituloFiltroCaravana = 'Permite buscar un servicio sin confirmar por el número de caravana de la vaca que participó en él.';                    
                    vm.tituloFiltroCategoria = 'Permite filtrar servicios sin confirmar según la categoría de la vaca que haya participado en él.';
                    vm.tituloFiltroEstado = 'Permite filtrar servicios sin confirmar por el estado en que se encuentran las vacas que participaron en él.';
                    vm.tituloFiltroRaza = 'Permite filtrar servicios sin confirmar cuyas vacas pertenezcan a la raza seleccionada.';
                    vm.tituloLimpiarCampos = 'todos los servicios sin confirmar';
                    vm.tituloBuscar = 'los servicios sin confirmar';
                    vm.tituloFiltroFechaInseminacion = 'los Servicios sin confirmar cuya inseminación se produjo';
                    vm.tituloFiltroEstadoServ = 'la vaca que participó de dicha inseminación';
                    vm.tituloFiltroTipoInseminacion = 'Permite filtrar servicios sin confirmar cuyo tipo de inseminación pertenece al valor seleccionado.';
                    break;

            }            
            consultarBovinoService.inicializar({ idAmbitoEstado: '1', idCampo: $localStorage.usuarioInfo.codigoCampo }, function (data) {
                vm.categorias = [];
                for (var i = 0; i < data.categorias.length; i++) {
                    if (data.categorias[i].genero === 0)
                        vm.categorias.push(data.categorias[i]);
                }
                vm.estados = [];
                for (var i = 0; i < data.estados.length; i++) {
                    if (data.estados[i].genero !== 1 && data.estados[i].nombre !== 'Muerto' && data.estados[i].nombre !== 'Venta')
                        vm.estados.push(data.estados[i]);
                }
                vm.razas = data.razas;
                vm.rodeos = data.rodeos;
                vm.filtro.idCategoria = '0';
                vm.filtro.idRaza = '0';
                vm.filtro.idRodeo = '0';
                vm.filtro.idEstado = '0';
                vm.filtro.accionPeso = '0';
                vm.filtro.accionNroPartos = '0';
                vm.filtro.idTipoInseminacion = '0';
                vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
                consultar();
            }, function error(error) {
                $scope.$parent.unBlockSpinner();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function consultar() {
            vm.filtro.periodo = $localStorage.usuarioInfo.periodoConsulta;
            if (!vm.filtro.peso) vm.filtro.peso = 0;
            if (!vm.filtro.nroPartos) vm.filtro.nroPartos = 0;
            if (!vm.filtro.numCaravana) vm.filtro.numCaravana = 0;
            if (vm.filtro.fechaInseminacion) {
                if (typeof vm.filtro.fechaInseminacion === "string")
                    vm.filtro.fechaInseminacion = new Date(vm.filtro.fechaInseminacion.split('/')[2], (parseInt(vm.filtro.fechaInseminacion.split('/')[1]) - 1).toString(), vm.filtro.fechaInseminacion.split('/')[0]);
                vm.filtro.fechaInseminacion = convertirFecha(vm.filtro.fechaInseminacion);
            }
            if (vm.filtro.fechaParto) {
                if (typeof vm.filtro.fechaParto === "string")
                    vm.filtro.fechaParto = new Date(vm.filtro.fechaParto.split('/')[2], (parseInt(vm.filtro.fechaParto.split('/')[1]) - 1).toString(), vm.filtro.fechaParto.split('/')[0]);
                vm.filtro.fechaParto = convertirFecha(vm.filtro.fechaParto);
            }
            if (vm.tablaActiva === 0) { //Vacas para servicio
                reporteInseminacionService.getHembrasParaServir({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                    if (data.length === 0) {
                        vm.disabledExportar = 'disabled';
                        vm.disabled = '';
                        vm.hembrasParaServir = [];
                        if (vm.filtro.peso === 0) vm.filtro.peso = '';
                        if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                        if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                        toastr.info("No se ha encontrado ninguna Hembra para Servir", "Aviso");
                    }
                    else {
                        vm.hembrasParaServir = data;
                        if (vm.filtro.peso === 0) vm.filtro.peso = '';
                        if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                        if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                        vm.disabled = '';
                        vm.disabledExportar = '';                        
                    }
                    $scope.$parent.unBlockSpinner();
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
            else if (vm.tablaActiva === 1) { //Lactancias Activas
                reporteInseminacionService.getLactanciasActivas({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                    if (data.length === 0) {
                        vm.disabledExportar = 'disabled';
                        vm.disabled = '';
                        vm.lactanciasActivas = [];
                        if (vm.filtro.peso === 0) vm.filtro.peso = '';
                        if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                        if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                        toastr.info("No se ha encontrado ninguna Lactancia activa", "Aviso");
                    }
                    else {
                        vm.lactanciasActivas = data;
                        if (vm.filtro.peso === 0) vm.filtro.peso = '';
                        if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                        if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                        vm.disabled = '';
                        vm.disabledExportar = '';
                    }
                    $scope.$parent.unBlockSpinner();
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
            else if (vm.tablaActiva === 2) { //Vacas preñadas
                reporteInseminacionService.getPreniadas({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {                    
                    if (data.length === 0) {
                        vm.disabledExportar = 'disabled';
                        vm.disabled = '';
                        vm.preniadas = [];
                        if (vm.filtro.peso === 0) vm.filtro.peso = '';
                        if (vm.filtro.fechaParto) vm.filtro.fechaParto = vm.filtro.fechaParto.substring(0, 10);
                        if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                        toastr.info("No se ha encontrado ninguna vaca Preñada", "Aviso");
                    }
                    else {
                        vm.preniadas = data;
                        if (vm.filtro.peso === 0) vm.filtro.peso = '';
                        if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                        if (vm.filtro.fechaParto) vm.filtro.fechaParto = vm.filtro.fechaParto.substring(0, 10);
                        vm.disabled = '';
                        vm.disabledExportar = '';
                    }
                    $scope.$parent.unBlockSpinner();
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
            else if (vm.tablaActiva === 3) { //Servicios sin confirmar
                reporteInseminacionService.getServiciosSinConfirmar({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {                    
                    if (data.length === 0) {
                        vm.disabledExportar = 'disabled';
                        vm.disabled = '';
                        vm.serviciosSinConfirmar = [];
                        if (vm.filtro.peso === 0) vm.filtro.peso = '';
                        if (vm.filtro.fechaInseminacion) vm.filtro.fechaInseminacion = vm.filtro.fechaInseminacion.substring(0, 10);
                        if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                        toastr.info("No se ha encontrado ningún Servicio sin Confirmar", "Aviso");
                    }
                    else {
                        vm.serviciosSinConfirmar = data;
                        if (vm.filtro.peso === 0) vm.filtro.peso = '';
                        if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                        if (vm.filtro.fechaInseminacion) vm.filtro.fechaInseminacion = vm.filtro.fechaInseminacion.substring(0, 10);
                        vm.disabled = '';
                        vm.disabledExportar = '';                       
                    }
                    $scope.$parent.unBlockSpinner();
                }, function error(error) {
                    $scope.$parent.unBlockSpinner();
                    $scope.$parent.errorServicio(error.statusText);
                });
            }
            else
                $state.go('home.reportes');
        };

        function limpiarCampos() {
            vm.filtro = {};
            vm.filtro.idCategoria = '0';
            vm.filtro.genero = '2';
            vm.filtro.idRaza = '0';
            vm.filtro.idRodeo = '0';
            vm.filtro.idEstado = '0';
            vm.filtro.accionPeso = '0';
            vm.filtro.accionNroPartos = '0';
            vm.filtro.numCaravana = '';
            vm.filtro.idTipoInseminacion = '0';
            vm.filtro.codigoCampo = $localStorage.usuarioInfo.codigoCampo;
            consultar();
        };

        function exportarHembrasServicioPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (!vm.filtro.peso) vm.filtro.peso = 0;
            if (!vm.filtro.nroPartos) vm.filtro.nroPartos = 0;
            if (!vm.filtro.numCaravana) vm.filtro.numCaravana = 0;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            reporteInseminacionService.generarPDFHembrasServicio({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
                });
                $(link).click();
                toastr.success('PDF generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarServiciosSinConfirmarPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (!vm.filtro.peso) vm.filtro.peso = 0;
            if (!vm.filtro.numCaravana) vm.filtro.numCaravana = 0;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            if (vm.filtro.fechaInseminacion) {
                if (typeof vm.filtro.fechaInseminacion === "string")
                    vm.filtro.fechaInseminacion = new Date(vm.filtro.fechaInseminacion.split('/')[2], (parseInt(vm.filtro.fechaInseminacion.split('/')[1]) - 1).toString(), vm.filtro.fechaInseminacion.split('/')[0]);
                vm.filtro.fechaInseminacion = convertirFecha(vm.filtro.fechaInseminacion);
            }
            reporteInseminacionService.generarPDFServiciosSinConfirmar({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
                });
                $(link).click();
                toastr.success('PDF generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarLactanciasPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (!vm.filtro.peso) vm.filtro.peso = 0;
            if (!vm.filtro.nroPartos) vm.filtro.nroPartos = 0;
            if (!vm.filtro.numCaravana) vm.filtro.numCaravana = 0;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            reporteInseminacionService.generarPDFLactancias({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
                });
                $(link).click();
                toastr.success('PDF generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarPreniadasPDF() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (!vm.filtro.peso) vm.filtro.peso = 0;
            if (!vm.filtro.numCaravana) vm.filtro.numCaravana = 0;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            if (vm.filtro.fechaParto) {
                if (typeof vm.filtro.fechaParto === "string")
                    vm.filtro.fechaParto = new Date(vm.filtro.fechaParto.split('/')[2], (parseInt(vm.filtro.fechaParto.split('/')[1]) - 1).toString(), vm.filtro.fechaParto.split('/')[0]);
                vm.filtro.fechaParto = convertirFecha(vm.filtro.fechaParto);
            }
            reporteInseminacionService.generarPDFPreniadas({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path, '_blank');
                });
                $(link).click();
                toastr.success('PDF generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarHembrasServicioExcel() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (!vm.filtro.peso) vm.filtro.peso = 0;
            if (!vm.filtro.nroPartos) vm.filtro.nroPartos = 0;
            if (!vm.filtro.numCaravana) vm.filtro.numCaravana = 0;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            reporteInseminacionService.generarExcelHembrasServicio({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path);
                    //window.location.href = portalService.getUrlServer() + '\\Archivos\\' + path;
                });
                $(link).click();
                toastr.success('Excel generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarServiciosSinConfirmarExcel() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (!vm.filtro.peso) vm.filtro.peso = 0;
            if (!vm.filtro.numCaravana) vm.filtro.numCaravana = 0;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            if (vm.filtro.fechaInseminacion) {
                if (typeof vm.filtro.fechaInseminacion === "string")
                    vm.filtro.fechaInseminacion = new Date(vm.filtro.fechaInseminacion.split('/')[2], (parseInt(vm.filtro.fechaInseminacion.split('/')[1]) - 1).toString(), vm.filtro.fechaInseminacion.split('/')[0]);
                vm.filtro.fechaInseminacion = convertirFecha(vm.filtro.fechaInseminacion);
            }
            reporteInseminacionService.generarExcelServiciosSinConfirmar({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path);
                });
                $(link).click();
                toastr.success('Excel generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarLactanciasExcel() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (!vm.filtro.peso) vm.filtro.peso = 0;
            if (!vm.filtro.nroPartos) vm.filtro.nroPartos = 0;
            if (!vm.filtro.numCaravana) vm.filtro.numCaravana = 0;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;
            reporteInseminacionService.generarExcelLactancias({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.nroPartos === 0) vm.filtro.nroPartos = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path);
                });
                $(link).click();
                toastr.success('Excel generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function exportarPreniadasExcel() {
            $scope.$parent.blockSpinnerGenerarArchivo();
            if (!vm.filtro.peso) vm.filtro.peso = 0;
            if (!vm.filtro.numCaravana) vm.filtro.numCaravana = 0;
            vm.filtro.usuario = $sessionStorage.usuarioInfo.usuario;
            vm.filtro.campo = $localStorage.usuarioInfo.campoNombre;

            if (vm.filtro.fechaParto) {
                if (typeof vm.filtro.fechaParto === "string")
                    vm.filtro.fechaParto = new Date(vm.filtro.fechaParto.split('/')[2], (parseInt(vm.filtro.fechaParto.split('/')[1]) - 1).toString(), vm.filtro.fechaParto.split('/')[0]);
                vm.filtro.fechaParto = convertirFecha(vm.filtro.fechaParto);
            }
            reporteInseminacionService.generarExcelPreniadas({ 'filtro': angular.toJson(vm.filtro, false) }, function (data) {
                if (vm.filtro.peso === 0) vm.filtro.peso = '';
                if (vm.filtro.numCaravana === 0) vm.filtro.numCaravana = '';
                var path = data.nombre;
                var link = document.createElement("a");
                $(link).click(function (e) {
                    e.preventDefault();
                    window.open(portalService.getUrlServer() + '\\Archivos\\' + path);
                });
                $(link).click();
                toastr.success('Excel generado con Éxito!', 'Éxito');
                $scope.$parent.unBlockSpinnerGenerarArchivo();
            }, function error(error) {
                $scope.$parent.unBlockSpinnerGenerarArchivo();
                $scope.$parent.errorServicio(error.statusText);
            });
        };

        function getFechaInsemacion() {
            vm.filtro.fechaInseminacion = $('#datetimepicker4')[0].value;
            var fechaInseminacion = new Date(vm.filtro.fechaInseminacion.substring(6, 10), parseInt(vm.filtro.fechaInseminacion.substring(3, 5)) - 1, vm.filtro.fechaInseminacion.substring(0, 2));
            var fechaMin = new Date(2000, 1, 1);
            if (fechaInseminacion < fechaMin) {
                vm.formReporteInseminacion.fechaInseminacion.$setValidity("min", false);
            }
            else {
                vm.formReporteInseminacion.fechaInseminacion.$setValidity("min", true);
            }
        };

        function getFechaParto() {
            vm.filtro.fechaParto = $('#datetimepicker5')[0].value;
            var fechaParto = new Date(vm.filtro.fechaParto.substring(6, 10), parseInt(vm.filtro.fechaParto.substring(3, 5)) - 1, vm.filtro.fechaParto.substring(0, 2));
            var fechaMin = new Date(2000, 1, 1);
            if (fechaParto < fechaMin) {
                vm.formReporteInseminacion.fechaParto.$setValidity("min", false);
            }
            else {
                vm.formReporteInseminacion.fechaParto.$setValidity("min", true);
            }
        };

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
        };
    }
})();