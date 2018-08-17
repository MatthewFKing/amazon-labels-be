const roHeader1 = "Flag,PONum,Status,VendorName,VendorContact,RemitToName,RemitToAddress,RemitToCity,RemitToState,RemitToZip,RemitToCountry,ShipToName,DeliverToName,ShipToAddress,ShipToCity,ShipToState,ShipToZip,ShipToCountry,CarrierName,VendorSONum,CustomerSONum,CreatedDate,CompletedDate,ConfirmedDate,FulfillmentDate,IssuedDate,Buyer,ShippingTerms,PaymentTerms,FOB,Note,QuickBooksClassName,LocationGroupName,URL,CF-Invoice #,CF-Invoice Date";
const roHeader2 = "Flag, ,PartNumber,VendorPartNumber,PartQuantity,FulfilledQuantity,PickedQuantity,UOM,PartPrice,FulfillmentDate,LastFulfillmentDate,RevisionLevel,Note,QuickBooksClassName,,,,,,,,,,,,,,,,,,,,,,";
const roPoLine = "PO,,10,Amazon Vendor Returns,Main Address,Amazon Vendor Returns,410 Terry Ave N,Seattle,WA,,Receiving,CUK,,1555 Standing Ridge Drive Suite A-1,Powhatan,VA,23139,UNITED STATES,Will Call,,,,,,,,,,,,,,,,,";
const roItemLine = "Item,10,,,,,,ea,0,,,,,,,,,,,,,,,,,,,,,,,,,,,";

exports.roHeader1 = roHeader1;
exports.roHeader2 = roHeader2;
exports.roPoLine = roPoLine;
exports.roItemLine = roItemLine;