using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sgg_farmix_acceso_datos.Helper
{
    public interface IManager<T>
    {
        //T Get(long Id, long empresaId);
        //T GetFilter(long empresaId);
        T Get(long id);
        T GetFilter();
        IEnumerable<T> Get(T entity);
        T Create(T entity);
        T Update(long id, T entity);
        void Delete(long id);
    }
}
