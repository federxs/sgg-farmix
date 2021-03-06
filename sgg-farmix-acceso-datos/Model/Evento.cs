﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Model
{
    public class Evento
    {
        public long idEvento { get; set; }
        public string fechaHora { get; set; }
        public long idTipoEvento { get; set; }
        public long idVacuna { get; set; }
        public float cantidad { get; set; }
        public long idCampoDestino { get; set; }
        public long idAntibiotico { get; set; }
        public long idAlimento { get; set; }
        public long idRodeoDestino { get; set; }
    }

    public class EventosItem
    {
        public long idEvento { get; set; }
        public string tipoEvento { get; set; }
        public string fechaHora { get; set; }
        public long cantidadBovinos { get; set; }
        public string nombre { get; set; }
    }

    public class EventoFilter
    {
        public long numCaravana { get; set; }
        public long idTipoEvento { get; set; }
        public string fechaDesde { get; set; }
        public string fechaHasta { get; set; }
        public long codigoCampo { get; set; }
        public string periodo { get; set; }
        public string campo { get; set; }
        public string usuario { get; set; }
    }

    public class EventoDetalle
    {
        public long idEvento { get; set; }
        public string fechaHora { get; set; }
        public string tipoEvento { get; set; }
        public long idTipoEvento { get; set; }
        public string vacuna { get; set; }
        public string antibiotico { get; set; }
        public string campoDestino { get; set; }
        public string rodeoDestino { get; set; }
        public string alimento { get; set; }
        public List<BovinoItem> listaBovinos { get; set; }
        public float cantidad { get; set; }
    }
}
