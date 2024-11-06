using System.Text.Json;
using System.Text.Json.Serialization;

namespace IMSwebAPI
{
    public class MyCustomLogger
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public MyCustomLogger(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task LogRequest(int actionbyuserId, string actiontype, string tablename, string oldEntity, string newEntity, int primarykey, string actionbyip, string extranotes)
        {
            try
            {

                var audit = new Audit();
                audit.ActionDatetime = DateTime.Now;
                audit.ActionByUserId = actionbyuserId;
                audit.ActivityType = actiontype.Substring(0, Math.Min(actiontype.Length, 50));
                audit.ActionByIpaddress = actionbyip.Substring(0, Math.Min(actionbyip.Length, 50));
                audit.ExtraNotes = extranotes;
                audit.TableName = tablename.Substring(0, Math.Min(tablename.Length, 50));
                var emptyJson = "{}";


                var oldEntityJson = string.IsNullOrEmpty(oldEntity) ? "{}" : oldEntity;
                var newEntityJson = string.IsNullOrEmpty(newEntity) ? "{}" : newEntity;


                if (oldEntity == "{}" && newEntity == "{}")
                {
                    audit.OldEntity = "";
                    audit.NewEntity = "";
                }
                else if (oldEntityJson != "{}" && newEntityJson != "{}")
                {
                    var oldEntityDocument = JsonDocument.Parse(oldEntityJson);
                    var newEntityDocument = JsonDocument.Parse(newEntityJson);

                    var modifiedFields = GetModifiedFields(oldEntityDocument.RootElement, newEntityDocument.RootElement);
                    var modifiedOldEntityJson = GetFieldsAsJson(oldEntityDocument.RootElement, modifiedFields);
                    var modifiedNewEntityJson = GetFieldsAsJson(newEntityDocument.RootElement, modifiedFields);
                    audit.OldEntity = modifiedOldEntityJson == emptyJson ? "" : modifiedOldEntityJson;
                    audit.NewEntity = modifiedNewEntityJson == emptyJson ? "" : modifiedNewEntityJson;
                }
                else if (newEntityJson != "{}")
                {
                    audit.OldEntity = "";
                    audit.NewEntity = newEntity;
                }


                //audit.OldEntity = modifiedOldEntityJson;
                //audit.NewEntity = modifiedNewEntityJson;
                audit.ModifiedPk = primarykey;

                _context.Audits.Add(audit);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                try
                {
                    var audit = new Audit();
                    audit.ActionDatetime = DateTime.Now;
                    audit.ActionByUserId = 0;
                    audit.ActivityType = "System Error - API - Can't save log!";
                    audit.ActionByIpaddress = "";
                    audit.ExtraNotes = $"actionbyuserid: {actionbyuserId}, actiontype: {actiontype}, Tablename: {tablename}, Exception: {ex.Message}";
                    audit.TableName = "";
                    audit.OldEntity = "";
                    audit.NewEntity = "";
                    audit.ModifiedPk = 0;

                    _context.Audits.Add(audit);
                    await _context.SaveChangesAsync();
                }
                catch (Exception)
                {
                    // Handle the exception
                }
            }
        }
        public string SerializeItNow(object theobject)
        {
            JsonSerializerOptions options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.IgnoreCycles,
                // MaxDepth = 64, // Optional: You can adjust the maximum depth limit as needed
                // IncludeFields = true,
                // WriteIndented = true
            };

            return JsonSerializer.Serialize(theobject, options);
        }



        private List<string> GetModifiedFields(JsonElement oldEntity, JsonElement newEntity)
        {
            var modifiedFields = new List<string>();

            foreach (var oldProp in oldEntity.EnumerateObject())
            {
                if (newEntity.TryGetProperty(oldProp.Name, out var newProp))
                {
                    if (oldProp.Value.ToString() != newProp.ToString())
                    {
                        modifiedFields.Add(oldProp.Name);
                    }
                }
            }

            return modifiedFields;
        }

        private string GetFieldsAsJson(JsonElement entity, List<string> fields)
        {
            var jsonObject = new Dictionary<string, JsonElement>();
            foreach (var field in fields)
            {
                if (TryGetPropertyValue(entity, field, out var value))
                {
                    jsonObject[field] = value;
                }
            }
            var jsonSerializerOptions = new JsonSerializerOptions
            {
                WriteIndented = true
            };
            return JsonSerializer.Serialize(jsonObject, jsonSerializerOptions);
        }

        private bool TryGetPropertyValue(JsonElement entity, string propertyPath, out JsonElement value)
        {
            var properties = propertyPath.Split('.');
            var currentElement = entity;
            for (var i = 0; i < properties.Length; i++)
            {
                var property = properties[i];
                if (currentElement.ValueKind == JsonValueKind.Object && currentElement.TryGetProperty(property, out var nextElement))
                {
                    currentElement = nextElement;
                }
                else if (currentElement.ValueKind == JsonValueKind.Array && int.TryParse(property, out var index) && index >= 0 && index < currentElement.GetArrayLength())
                {
                    currentElement = currentElement.EnumerateArray().ElementAt(index);
                }
                else
                {
                    value = default;
                    return false;
                }
            }
            value = currentElement;
            return true;
        }


    }
}
