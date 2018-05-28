using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace sgg_farmix_acceso_datos.Model
{
    public class MoveFiles
    {
        public static void MoveFilesToFolder(string path, string fileName, string codigoCampo)
        {

            string path2 = HttpContext.Current.Server.MapPath("~\\Images\\Campo\\") + $"{codigoCampo}\\";
            Directory.CreateDirectory(path2);
            try
            {
                // Move the file.
                File.Move(path, path2 + fileName);
                Console.WriteLine("{0} was moved to {1}.", path, path2);

                // See if the original exists now.
                if (File.Exists(path))
                {
                    Console.WriteLine("The original file still exists, which is unexpected.");
                }
                else
                {
                    Console.WriteLine("The original file no longer exists, which is expected.");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("The process failed: {0}", e.ToString());
            }
        }

        public static void MoveFilesUsuarioToFolder(string path, string fileName)
        {

            string path2 = HttpContext.Current.Server.MapPath("~\\Images\\Usuario\\");
            Directory.CreateDirectory(path2);
            try
            {
                // Move the file.
                File.Move(path, path2 + fileName);
                Console.WriteLine("{0} was moved to {1}.", path, path2);

                // See if the original exists now.
                if (File.Exists(path))
                {
                    Console.WriteLine("The original file still exists, which is unexpected.");
                }
                else
                {
                    Console.WriteLine("The original file no longer exists, which is expected.");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("The process failed: {0}", e.ToString());
            }
        }

        public static void DeleteFilesUsuarioToFolder(string path, string fileName)
        {

            string path2 = HttpContext.Current.Server.MapPath("~\\Images\\Usuario\\");
            if (Directory.Exists(path2))
            {
                try
                {
                    // Move the file.
                    File.Delete(path2 + fileName);
                    Console.WriteLine("{0} was moved to {1}.", path, path2);

                    // See if the original exists now.
                    if (File.Exists(path))
                    {
                        Console.WriteLine("The original file still exists, which is unexpected.");
                    }
                    else
                    {
                        Console.WriteLine("The original file no longer exists, which is expected.");
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine("The process failed: {0}", e.ToString());
                }
            }
        }
    }
}
