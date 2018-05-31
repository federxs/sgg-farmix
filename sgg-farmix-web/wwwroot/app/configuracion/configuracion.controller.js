(function () {
    'use strict';

    angular
        .module('app')
        .controller('configuracionController', configuracionController);

    configuracionController.$inject = ['$scope', 'configuracionService', 'toastr', '$localStorage', '$sessionStorage', 'razaService', '$timeout', 'alimentoService', 'rodeoService', 'estadoService', 'categoriaService', 'establecimientoOrigenService', 'antibioticoService', 'vacunaService', 'registrarBovinoService', 'portalService', '$state'];

    function configuracionController($scope, configuracionService, toastr, $localStorage, $sessionStorage, razaService, $timeout, alimentoService, rodeoService, estadoService, categoriaService, establecimientoOrigenService, antibioticoService, vacunaService, registrarBovinoService, portalService, $state) {
        //$scope.showSpinner = true;
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
            configuracionService.getDatosPerfilUsuario({ campo: $localStorage.usuarioInfo.codigoCampo, usuario: $sessionStorage.usuarioInfo.usuario }, function (data) {
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
