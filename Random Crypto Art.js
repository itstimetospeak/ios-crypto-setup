// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: images;
const { transparent } = importModule('no-background');

// icloud connection if you want to save cryptoart information, can be removed if you don't want that
let icloud = FileManager.iCloud();

// Font Setup
let hlFont = new Font("Cochin-BoldItalic", 14);
let titleFont = new Font("AvenirNext-Regular", 18);
let priceFont = new Font("AvenirNext-Medium", 16);
let myFontColor = Color.white();

// API connection to coinranking
// change dapp if you prefer another platform
const dapp = `superrare`
const url = `https://api.coinranking.com/v2/nfts?dappSlug=${dapp}&orderBy=auctionCreatedAt&limit=50`
const req = new Request(url)
const res = await req.loadJSON();

// save artworks
let artworks = res.data.nfts;
let expensive_artworks = [];

console.log(`Amount of retrieved artworks: ${artworks.length}`);

artworks.forEach(artwork=>{  
  if(artwork.price>1.5){   
    expensive_artworks.push(artwork);
  }
});
 
console.log(`Amount of expensive artworks: ${expensive_artworks.length}`);

// get random artpiece
let rand = Math.floor(Math.random() * expensive_artworks.length);
let art = expensive_artworks[rand]

// get image
let imageURL = art.image;
console.log(imageURL)
let i = new Request(imageURL);
let img = await i.loadImage();

// create widget with transparent background
let w = new ListWidget()
w.backgroundImage = await transparent(Script.name())  
w.setPadding(5, 5, 5, 5);
w.url = art.externalUrl;

// get current time
let myTimeFormat = new DateFormatter();
myTimeFormat.useShortTimeStyle();
let now = myTimeFormat.string(new Date());

// createheadline
let headline = w.addText(`random crypto art of ${now}`);
headline.font = hlFont;
headline.centerAlignText();
headline.textColor = myFontColor;
w.addSpacer(1);

// create art piece title
let title_text = w.addText(art.name);
title_text.font = titleFont;
title_text.centerAlignText();
title_text.textColor = myFontColor;
w.addSpacer(1);

// create price label  
let dollar = Number(art.priceInDollar).toFixed(2);
let priceInfo = `${art.price}Ξ | ${dollar}$`;
let price_text = w.addText(priceInfo);
price_text.font = priceFont;
price_text.centerAlignText();
price_text.textColor = myFontColor;
w.addSpacer(10);

// add image
let nftimg = w.addImage(img);
nftimg.url = art.externalUrl;
nftimg.centerAlignImage();

// save information to icloud
let database = icloud.bookmarkedPath("database");
let filePath = `${database}/currentnft.txt`;
console.log(filePath);
icloud.writeString(filePath, art.id)

// check if run inside widget or from inside this app
if (config.runsInWidget) {
  Script.setWidget(w)
  Script.complete()
}
else {
  w.presentLarge()

}