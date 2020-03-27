
// Define an interface for the objects
interface CreditCard{
    getName(): string;
    accept(v: OfferVisitor): void;
}

// Define concrete implementations of the objects with an accept method
// Accept method takes the abstract type of visitor, in this case offers
class SilverCreditCard implements CreditCard{
    getName(): string{
        return "silver card"
    }
    accept(v: OfferVisitor) {
        v.visitSilverCreditCard(this)
    }
}

class BronzeCreditCard implements CreditCard{
    getName(): string{
        return "silver card"
    }
    accept(v: OfferVisitor) {
        v.visitBronzeCreditCard(this)

    }
}

class GoldCreditCard implements CreditCard{
    getName(): string{
        return "silver card"
    }
    accept(v: OfferVisitor) {
        v.visitGoldCreditCard(this)

    }
}

// define the interface
interface OfferVisitor{
    visitBronzeCreditCard(cc:BronzeCreditCard);
    visitSilverCreditCard(cc:SilverCreditCard);
    visitGoldCreditCard(cc:GoldCreditCard);

}

class GasOfferVisitor implements OfferVisitor {
    
    visitBronzeCreditCard(cc:BronzeCreditCard){
        console.log('we are offfering 10% discount on gas')
    }

    visitSilverCreditCard(cc:SilverCreditCard){
        console.log('we are offering 10% discount on silver card')
    }
    visitGoldCreditCard(cc:GoldCreditCard){
        console.log('we are offering 5% discount on gold credit card')
    }

}

class HotelOfferVisitor implements OfferVisitor{
    visitBronzeCreditCard(cc:BronzeCreditCard){
        console.log('we are offfering 10% discount on hotel')
    }

    visitSilverCreditCard(cc:SilverCreditCard){
        console.log('we are offering 10% discount on silver hotel')
    }
    visitGoldCreditCard(cc:GoldCreditCard){
        console.log('we are offering 5% discount on gold credit hotel')
    }
}


let hotelOfferVisitor:HotelOfferVisitor = new HotelOfferVisitor()

let bCC:BronzeCreditCard = new BronzeCreditCard()
let sCC:SilverCreditCard = new SilverCreditCard()
let gCC:GoldCreditCard = new GoldCreditCard()

bCC.accept(hotelOfferVisitor)

