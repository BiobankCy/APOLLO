using System;

namespace IMSwebAPI.Models.CustomModels
{
    public class UpdateStockRequestParams
    {


        public List<Stock> stocklist { get; set; }
        public StockTran transreq { get; set; }
        public int reqlineID { get; set; }
        public Receiving? rh { get; set; }


    }
}
