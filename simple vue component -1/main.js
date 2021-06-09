var eventBus = new Vue()



Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
    <div class="product-image">
        <img v-bind:src="image">
    </div>
    <div class=" product-info">
        <h1 :style="{color:colorHex}">{{title}}</h1>
        <p v-if="inStock">In Stock</p>
        <p :class="{lineThrough: !inStock }" v-else>Out of Stock</p>
        <p>Shipping:{{ shipping }}

        <ul>
            <li v-for="detail in details"> {{ detail }} </li>
        </ul>

        <div v-for="(variant,index) in variants" :key="variant.variantId" class="color-box"
            :style="{backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
        </div>

        <button v-on:click="addToCart" :disabled="!inStock || !onSale"
            :class="{disabledButton: !inStock || !onSale}">
            Add to Cart
        </button>
        <button style="background-color: red;" @click="dropItem">Drop item </button> 
    </div>

    <product-tabs :reviews="reviews"> </product-tabs>

   

</div>
`,
    data() {
        return {
            brand: "Vue ",
            product: 'Socks',
            selectedVariant: 0,
            colorHex: " ",
            //conditional rendering 
            textDecoration: 'line-through',

            //list rendering
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "#309C64",
                    variantColorName: "Green",
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 1,
                    variantOnSale: true
                },
                {
                    variantId: 2235,
                    variantColor: "#455B73",
                    variantColorName: "Blue",
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                    variantOnSale: true
                }
            ],

            reviews: []
        }
    },
    //all functions are under the methods 
    methods: {
        addToCart() {
            this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId)

        },
        dropItem() {
            this.$emit("drop-item")
        },
        updateProduct(index) {
            this.selectedVariant = index
            // console.log(index)
        },

    },
    computed: {
        title() {
            colorName = this.variants[this.selectedVariant].variantColorName
            this.colorHex = this.variants[this.selectedVariant].variantColor
            return this.brand + " " + this.product + " " + colorName
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        onSale() {
            return this.variants[this.selectedVariant].variantOnSale
        },
        shipping() {
            if (this.premium) {
                return " Free"
            }
            return " 2.99$"
        }
    },
    //life cycle hook
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})


Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
                <li v-for="error in errors"> {{error}} </li>
        </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
        
    <p>
      <input type="submit" value="Submit">  
    </p>    
  
  </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")

            }


        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span class="tab"
                    :class=" { activeTab: selectedTab === tab }"
                    v-for="(tab,index) in tabs" :key="index"
                     @click="selectedTab = tab">
                    {{ tab }}
            </span>
             <div v-show="selectedTab === 'Reviews' ">
               <p v-if="!reviews.length">There are no reviews yet.</p>
                  <ul v-else>
                    <li v-for=" (review,index) in reviews" :key="index"> 
                        <p>{{review.name}}</p> 
                        <p>Rating: {{review.rating}}</p> 
                        <p> {{review.review}}</p> 
              
                   </li>
                </ul>
            </div>
        
           <product-review v-show="selectedTab === 'Make a Review'" ></product-review>
         </div>   
         
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Make a Review'
        }
    }
})

//create Vue instance this is the heart that powers everything
const app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            if (this.cart.length < 10)
                this.cart.push(id)
        },
        dropItem() {
            this.cart.pop()
        }
    }

})




