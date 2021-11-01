import axios from "axios";
import * as M from "materialize-css";
import * as Vue from "vue";

// tslint:disable-next-line no-unused-expression
new Vue( {
    computed: {
        hasGuitars(): boolean {
            return (this as any).isLoading === false && (this as any).guitars.length > 0;
        },
        noGuitars(): boolean {
            return (this as any).isLoading === false && (this as any).guitars.length === 0;
        }
    },
    data() {
        return {
            brand: "",
            color: "",
            guitars: [],
            isLoading: true,
            model: "",
            selectedGuitar: "",
            selectedGuitarId: 0,
            year: ""
        };
    },
    el: "#app",
    methods: {
        addGuitar() {
            const guitar = {
                brand: (this as any).brand,
                color: (this as any).color,
                model: (this as any).model,
                year: (this as any).year
            };
            axios
                .post( "/api/guitars/add", guitar )
                .then( () => {
                    (this as any).$refs.year.focus();
                    (this as any).brand = "";
                    (this as any).color = "";
                    (this as any).model = "";
                    (this as any).year = "";
                    this.loadGuitars();
                } )
                .catch( ( err: any ) => {
                    // tslint:disable-next-line:no-console
                    console.log( err );
                } );
        },
        confirmDeleteGuitar( id: string ) {
            const guitar = (this as any).guitars.find( ( g: { id: string; } ) => g.id === id );
            (this as any).selectedGuitar = `${ guitar.year } ${ guitar.brand } ${ guitar.model }`;
            (this as any).selectedGuitarId = guitar.id;
            const dc = (this as any).$refs.deleteConfirm;
            const modal = M.Modal.init( dc );
            modal.open();
        },
        deleteGuitar( id: string ) {
            axios
                .delete( `/api/guitars/remove/${ id }` )
                .then( this.loadGuitars )
                .catch( ( err: any ) => {
                    // tslint:disable-next-line:no-console
                    console.log( err );
                } );
        },
        loadGuitars() {
            axios
                .get( "/api/guitars/all" )
                .then( ( res: any ) => {
                    (this as any).isLoading = false;
                    (this as any).guitars = res.data;
                } )
                .catch( ( err: any ) => {
                    // tslint:disable-next-line:no-console
                    console.log( err );
                } );
        }
    },
    mounted() {
        return this.loadGuitars();
    }
} );