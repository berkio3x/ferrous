var SilverCreditCard = /** @class */ (function () {
    function SilverCreditCard() {
    }
    SilverCreditCard.prototype.getName = function () {
        return "silver card";
    };
    SilverCreditCard.prototype.accept = function (v) {
        v.visitSilverCreditCard(this);
    };
    return SilverCreditCard;
}());
var BronzeCreditCard = /** @class */ (function () {
    function BronzeCreditCard() {
    }
    BronzeCreditCard.prototype.getName = function () {
        return "silver card";
    };
    BronzeCreditCard.prototype.accept = function (v) {
        v.visitBronzeCreditCard(this);
    };
    return BronzeCreditCard;
}());
var GoldCreditCard = /** @class */ (function () {
    function GoldCreditCard() {
    }
    GoldCreditCard.prototype.getName = function () {
        return "silver card";
    };
    GoldCreditCard.prototype.accept = function (v) {
        v.visitGoldCreditCard(this);
    };
    return GoldCreditCard;
}());
var GasOfferVisitor = /** @class */ (function () {
    function GasOfferVisitor() {
    }
    GasOfferVisitor.prototype.visitBronzeCreditCard = function (cc) {
        console.log('we are offfering 10% discount on gas');
    };
    GasOfferVisitor.prototype.visitSilverCreditCard = function (cc) {
        console.log('we are offering 10% discount on silver card');
    };
    GasOfferVisitor.prototype.visitGoldCreditCard = function (cc) {
        console.log('we are offering 5% discount on gold credit card');
    };
    return GasOfferVisitor;
}());
var HotelOfferVisitor = /** @class */ (function () {
    function HotelOfferVisitor() {
    }
    HotelOfferVisitor.prototype.visitBronzeCreditCard = function (cc) {
        console.log('we are offfering 10% discount on hotel');
    };
    HotelOfferVisitor.prototype.visitSilverCreditCard = function (cc) {
        console.log('we are offering 10% discount on silver hotel');
    };
    HotelOfferVisitor.prototype.visitGoldCreditCard = function (cc) {
        console.log('we are offering 5% discount on gold credit hotel');
    };
    return HotelOfferVisitor;
}());
var hotelOfferVisitor = new HotelOfferVisitor();
var bCC = new BronzeCreditCard();
var sCC = new SilverCreditCard();
var gCC = new GoldCreditCard();
bCC.accept(hotelOfferVisitor);
