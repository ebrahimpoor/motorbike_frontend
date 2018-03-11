import { Component, OnInit, ElementRef } from '@angular/core';
import { 
    FormGroup,
    Validators,
    FormBuilder ,
    FormControl
} from '@angular/forms';
import { HttpService } from './shared/services';
import { Motorbike } from './motorbike';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    public motorbike:Motorbike = new Motorbike;
    public formData: FormGroup;
    public lockBtn:boolean = false;
    public motorbikeItems:any = [];
    public colorItems:any = [];
    public modelItems:any = [];
    public ccItems:any = [];
    public loading:boolean = false;
    private sortType:boolean = false;

    public filters:any = {
        limit:5,
        last:0,
        model: '',
        color: '',
        cc: ''
    }
    private orders:object = {
        field: 'id',
        type: true
    };

    constructor(
        private el: ElementRef,
        private httpService: HttpService
    ) {

    }

    ngOnInit() {

        this.buildForm(this.motorbike);
        this.loadItems('motorbike', this.filters, this.orders);
        this.loadItems('color');
        this.loadItems('cc');
        this.loadItems('model');
        
    }


    sort(field) {
        this.sortType = !this.sortType;
        this.orders = {
            field: field,
            type: this.sortType
        };

        this.loadItems('motorbike', this.filters, this.orders);        
    }

    setFilters() {
        this.loadItems('motorbike', this.filters, this.orders);
    }

    loadItems(module, filters?, orders?) {
        this.loading = true;
        this[module+'Items'] = [];
        this.httpService.get(module, filters, orders)
        .subscribe(response => {
            this[module+'Items'] = this.prepareData(response);
            this.loading = false;
        });

    }

    addMotorbike() {
        if (this.formData.valid) {
            if(!this.lockBtn) {
                this.lockBtn = true;

                let formData = {
                    module: 'motorbike',
                    data: this.formData.value
                }
                this.httpService.create(formData)
                    .subscribe(response => {
                        if(response.done) {
                            this.loadItems('motorbike', this.filters, this.orders);
                        } else {
                            alert('FALSE!!!');
                        } 
                        this.lockBtn = false;
                    });
            }
        } else {
            this.lockBtn = false;
            alert('FALSE!!!');
        }
    }

    buildForm(defaultData:Motorbike): void {
        let fb = new FormBuilder();
        this.formData = fb.group({
            'model': [defaultData.model, [
                    Validators.required
                ]
            ],
            'color': [defaultData.color, [
                    Validators.required
                ]
            ],
            'cc': [defaultData.cc],
            'weight': [defaultData.weight],
            'price': [defaultData.price]
        });

    }

    newItem(module) {
        let title = prompt("Please enter "+module+" title:", "");
        if (title != null || title != "") {

            let formData = {
                module: module,
                data: {
                    title:title
                }
            }
            this.httpService.create(formData)
                .subscribe(response => {
                    if(response.done) {
                        this.loadItems(module);
                    } else {
                        alert('FALSE!!!');
                    } 
                });
        }
    }

    previous() {
        this.filters.last = this.filters.last - this.filters.limit ;
        this.loadItems('motorbike', this.filters, this.orders);
    }

    next() {
        this.filters.last = this.filters.last + this.filters.limit ;
        this.loadItems('motorbike', this.filters, this.orders);
    }

    prepareData(val) {
        if(val)
            return Object.keys(val).map(key => Object.assign({ key }, val[key]));
        return [];
    }
}
