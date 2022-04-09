import { Component, OnInit } from '@angular/core';
import {ProductsService} from "../../services/products.service";
import {Product} from "../../../model/product.model";
import {catchError, map, Observable, of, startWith} from "rxjs";
import {AppDataState, DataStateEnum} from "../../state/product.state";
import {Router} from "@angular/router";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
products$:Observable<AppDataState<Product[]>> |null=null;
readonly DataStateEnum=DataStateEnum;
  constructor(private productsService:ProductsService, private router:Router) { }

  ngOnInit(): void {
  }

  onGetAllProducts() {
   // @ts-ignore
    this.products$=this.productsService.getAllProducts().pipe(
     map(data=>({dataState:DataStateEnum.LOADED,data:data})),
     startWith({dataState:DataStateEnum.LOADING}),
     catchError(err=>of({dataState:DataStateEnum.ERROR,errorMessage:err.message}))
   );
  }

  onGetSelectedProducts() {
    // @ts-ignore
    this.products$=this.productsService.getSelectedProducts().pipe(
      map(data=>({dataState:DataStateEnum.LOADED,data:data})),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR,errorMessage:err.message}))
    );

  }

  onGetAvailableProducts() {
    // @ts-ignore
    this.products$=this.productsService.getAvailableProducts().pipe(
      map(data=>({dataState:DataStateEnum.LOADED,data:data})),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR,errorMessage:err.message}))
    );

  }

  onSearch(dataForm: any) {
    // @ts-ignore
    this.products$=this.productsService.searchProducts(dataForm.keyword).pipe(
      map(data=>({dataState:DataStateEnum.LOADED,data:data})),
      startWith({dataState:DataStateEnum.LOADING}),
      catchError(err=>of({dataState:DataStateEnum.ERROR,errorMessage:err.message}))
    );


  }

  onSelect(p: Product) {
this.productsService.select(p).subscribe(data=>{
  p.selected=data.selected;
  }

)
  }

  onDelete(p: Product) {
    let v=confirm("Etes vous sur de vouloir supprimer?");
    if(v==true)
    this.productsService.deleteProduct(p).subscribe(data=>{
      this.onGetAllProducts();
    })
  }

  onNewProduct() {
    this.router.navigateByUrl("/newProduct")

  }

  onEdit(p: Product) {
    this.router.navigateByUrl("/editProduct/"+p.id)
  }
}
