angular.module('starter', ['ionic', 'ngStorage'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (/*cordova.platformId === "ios" &&*/ window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'views/menu.html',
          controller: 'Controller'
      })
      .state('app.login', {
          cache: false,
          url: '/login',
          views: {
              'menuContent': {
                  templateUrl: 'views/login.html',
                  controller: 'LoginController'
              }
          }
      })
      .state('app.bienvenido', {
          url: '/bienvenido',
          views: {
              'menuContent': {
                  templateUrl: 'views/bienvenido.html',
                  controller: 'BienvenidoController'       
              }
            }
      })
      .state('app.leer', {
          url: '/leer',
          views: {
              'menuContent': {
                  templateUrl: 'views/leer.html'
              }
          }
      })
      .state('app.resultado/:id', {
          url: '/resultado/:id',
          views: {
              'menuContent': {
                  templateUrl: 'views/resultado.html',
                  controller: 'ResultadoController'
              }
          }
      })
      .state('app.escribir', {
          url: '/escribir',
          views: {
              'menuContent': {
                  templateUrl: 'views/escribir.html',
                  controller: 'EscribirController'
              }
          }
      })
      .state('app.escribirTag', {
          url: '/escribirTag',
          views: {
              'menuContent': {
                  templateUrl: 'views/escribirTag.html'
              }
          }
      })
       .state('app.registrarEvento', {
           url: '/registrarEvento',
           views: {
               'menuContent': {
                   templateUrl: 'views/registrarEvento.html',
                   controller: 'RegistrarEventoController'
               }
           }
       })
        .state('app.vacunacion', {
            url: '/vacunacion',
            views: {
                'menuContent': {
                    templateUrl: 'views/vacunacion.html',
                    controller: 'VacunacionController'
                }
            }
        })
        .state('app.manejo', {
            url: '/manejo',
            views: {
                'menuContent': {
                    templateUrl: 'views/manejo.html',
                    controller: 'ManejoController'
                }
            }
        })
        .state('app.antibiotico', {
            url: '/antibiotico',
            views: {
                'menuContent': {
                    templateUrl: 'views/antibiotico.html',
                    controller: 'AntibioticoController'
                }
            }
        })
        .state('app.alimento', {
            url: '/alimento',
            views: {
                'menuContent': {
                    templateUrl: 'views/alimento.html',
                    controller: 'AlimentoController'
                }
            }
        })
        .state('app.inseminacionMenu', {
            url: '/inseminacionMenu',
            views: {
                'menuContent': {
                    templateUrl: 'views/inseminacionMenu.html',
                    controller: 'InseminacionMenuController'
                }
            }
        })
        .state('app.registrarInseminacion', {
            url: '/registrarInseminacion',
            views: {
                'menuContent': {
                    templateUrl: 'views/registrarInseminacion.html',
                    controller: 'RegistrarInseminacionController'
                }
            }
        })
        .state('app.inseminacionesPendientes', {
            url: '/inseminacionesPendientes',
            views: {
                'menuContent': {
                    templateUrl: 'views/inseminacionesPendientes.html',
                    controller: 'InseminacionesPendientesController'
                }
            }
        })
        .state('app.verificarInseminacion', {
            url: '/verificarInseminacion/',
            params: { idInseminacion: null },
            views: {
                'menuContent': {
                    templateUrl: 'views/verificarInseminacion.html',
                    controller: 'VerificarInseminacionController'
                }
            }
        }).state('app.cerrarSesion', {
            url: '/cerrarSesion',
            params: { idInseminacion: null },
            views: {
                'menuContent': {
                    templateUrl: 'views/cerrarSesion.html',
                    controller: 'cerrarSesionController'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/bienvenido');
});
