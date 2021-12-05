import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { NeptexShopFormService } from 'src/app/services/neptex-shop-form.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];



  constructor(private formBuilder: FormBuilder,
    
    private neptexShopFormService: NeptexShopFormService, private cartService: CartService, private checkoutService: CheckoutService, private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                          [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', 
                          [Validators.required, Validators.minLength(2)]),
        email: new FormControl('',
                              [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
        )

      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
        
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']

      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']


      })

    });

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.neptexShopFormService.getCreditCardMonths(startMonth).subscribe(
      data=> {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;

      }
    );


    this.neptexShopFormService.getCreditCardYears().subscribe(
      data=>{
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;

      }


    );
  }
  reviewCartDetails() {

    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(

      totalPrice => this.totalPrice = totalPrice

    );
  }




  onSubmit(){
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get(`customer`).value);

    let order = new Order();

    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;


    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));


    let purchase = new Purchase();

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;


    purchase.order = order;
    purchase.orderItems = orderItems;


    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          alert(`Your Order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

          this.resetCart();
        },
        error: err =>{
          alert(`Thanks for the Purchase. Your Order has been received.`);
          this.resetCart();

        }
        
      }
    );

  }

  resetCart(){
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);


    this.checkoutFormGroup.reset();

    this.router.navigateByUrl("/products");

  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}

  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipcode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}

  


  copyShippingAddressToBillingAddress(event){

    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
      .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }


  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);


    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;

    }

    else{
      startMonth = 1;
    }

    this.neptexShopFormService.getCreditCardMonths(startMonth).subscribe(
      data =>{
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;

      }

    )
      
    

  }



}
