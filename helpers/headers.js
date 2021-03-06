const roHeader1 = "Flag,TONum,TOType,Status,FromLocationGroup,FromLocation,FromAddressName,FromAddressStreet,FromAddressCity,FromAddressState,FromAddressZip,FromAddressCountry,ToLocationGroup,ToAddressName,ToAddressStreet,ToAddressCity,ToAddressState,ToAddressZip,ToAddressCountry,OwnerIsFrom,CreatedDate,IssuedDate,CompletedDate,FulfillmentDate,ConfirmedDate,CarrierName,Note";
const roHeader2 = "Flag,PartNumber,PartQuantity,UOM,FulfillmentDate,Note,,,,,,,,,,,,,,,,,,,,,";
const roPoLine = "TO,UFAUG62018,Ship,20,Amazon,Amazon,Amazon,16920 W. Commerce Dr,Goodyear  ,AZ,85338,UNITED STATES,CUK Powhatan,CUK Powhatan,1555 Standing Ridge Drive Suite A-1,Powhatan,VA,23139,UNITED STATES,TRUE,,,,,,UPS,";
const roItemLine = "Item,,,ea,,,,,,,,,,,,,,,,,,,,,,,";


const invHeader1 = "PartNumber,PartDescription,Location,Qty,UOM,Cost,Date,Note,Tracking-Lot Number,Tracking-Condtion,";
const invItem = ",,Amazon-Amazon Shipping,,ea,0,,,,,";
const invSN = "Serial Number,,,,,,,,,,"
const invUF = ",,,,,,,,,,";

const partsHeader = "PartNumber,PartDescription,PartDetails,UOM,UPC,PartType,Active,ABCCode,Weight,WeightUOM,Width,Height,Length,SizeUOM,PrimaryTracking,AlertNote,PictureUrl,Tracks-Lot Number,Tracks-Serial Number,Tracks-Asset Tag,Tracks-Condtion,CF-MPN,CF-Max Spec Needed,CF-Integration Manual Needed,CF-CPU Type,CF-Processor,CF-CPU Base Frequency (GHz),CF-Screen Size,CF-Display Type,CF-Display (Long Form),CF-Screen Resolution,CF-Touchscreen?,CF-IPS?,CF-120Hz,CF-144Hz,CF-5ms Response Time,CF-3ms Response Time,CF-G-Sync,CF-Graphics Card,CF-VRAM (GB),CF-VR Ready?,CF-RAM Size,CF-RAM Type,CF-RAM Speed (MHz),CF-Max RAM Capability,CF-SSD,CF-SSD Type,CF-HDD,CF-HDD Speed (RPM),CF-Optical Drive,CF-Operating System,CF-Wireless,CF-Wifi Brand,CF-Bluetooth,CF-USB Ports,CF-USB 3.1 Type C,CF-Video Ports,CF-Thunderbolt,CF-Audio Ports,CF-Card Reader,CF-Keyboard,CF-Backlit Keyboard,CF-Fingerprint Reader,CF-Webcam,CF-Battery,CF-Power Supply (W),CF-Item Length (in),CF-Item Width (in),CF-Item Height (in),CF-Item Weight (lb)";
const partsItem = ",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,";

exports.roHeader1 = roHeader1;
exports.roHeader2 = roHeader2;
exports.roPoLine = roPoLine;
exports.roItemLine = roItemLine;
exports.invHeader1 = invHeader1;
exports.invItem = invItem;
exports.invSN = invSN;
exports.invUF = invUF;
exports.partsHeader = partsHeader;
exports.partsItem = partsItem;

const so = {
  header1: "Flag,SONum,Status,CustomerName,CustomerContact,BillToName,BillToAddress,BillToCity,BillToState,BillToZip,BillToCountry,ShipToName,ShipToAddress,ShipToCity,ShipToState,ShipToZip,ShipToCountry,CarrierName,TaxRateName,PriorityId,PONum,VendorPONum,Date,Salesman,ShippingTerms,PaymentTerms,FOB,Note,QuickBooksClassName,LocationGroupName,FulfillmentDate,URL,CarrierService,DateExpired,Phone,Email,CF-Delivery Deadline",
  header2: "Flag,SOItemTypeID,ProductNumber,ProductDescription,ProductQuantity,UOM,ProductPrice,Taxable,TaxCode,Note,QuickBooksClassName,FulfillmentDate,ShowItem,KitItem,RevisionLevel,,,,,,,,,,,,,,,,,,,,,,",
  line: "SO,,20,,,,,,,,United States,,,,,,United States,UPS,None,30,,,,,Prepaid & Billed,,Origin,,None,CUK Powhatan,,,,,,,",
  item: "Item,10,,,,ea,,FALSE,,,None,,TRUE,FALSE,,,,,,,,,,,,,,,,,,,,,,,",
  shipping: "Item,60,SHIPPING,Shipping Fees,1,ea,,FALSE,,,None,,TRUE,FALSE,,,,,,,,,,,,,,,,,,,,,,,",
  gst: "Item,60,GST/HST,GST/HST,1,ea,,FALSE,,,None,,TRUE,FALSE,,,,,,,,,,,,,,,,,,,,,,,",
  eWaste: "Item,60,E-waste Recycling Fee,E-waste Recycling Fee,1,ea,,FALSE,,,None,,TRUE,FALSE,,,,,,,,,,,,,,,,,,,,,,,",
  tax: "Item,70,Sales Tax,Sales Tax,1,ea,$63.00 ,FALSE,,,None,6/27/2019,TRUE,FALSE,,,,,,,,,,,,,,,,,,,,,,,"
}

exports.so = so;