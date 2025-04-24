// HTML pitää olla täysin ladattu enne kun suoritetaan koodia
document.addEventListener("DOMContentLoaded", function() {
    //Haetaan valikko, hakukenttä ja hakupainike HTML:stä, jotta niihin voidaan liittää toimintoja
    var select = document.getElementById("categorySelect");
    var input = document.getElementById("searchInput");
    var btn = document.getElementById("searchBtn");
    
    //luo AJAX-olio ja  tehdään GET-pyyntö kategorioden hakemiseks
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://fakestoreapi.com/products/categories", true);

    //kuunnellaan kun vastaus valmis
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            //muunnetaan json-teksti js-taulukoksi
            var categories = JSON.parse(xhr.responseText);
            //luodaan pudotusvalikon <option>-elementit kategorioista
            categories.forEach(function(cat) {
                var opt = document.createElement("option");
                opt.value = cat;
                //kat. ensimmäinen kirjain isoksi
                opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
                select.appendChild(opt);
            });
            //kun kategoriat on ladattu, ladataan kaikki tuotteet
            getProducts("", ""); 
        }
    };
    //lähetetään pyyntö
    xhr.send();

    //kun kategoria vaihtuu tai hakupainiketta klikataan, haetaan tuotteet
    select.addEventListener("change", function() {
        getProducts(select.value, input.value.trim());
    });

    btn.addEventListener("click", function() {
        getProducts(select.value, input.value.trim());
    });
});

//funktio tuotteiden hakemiseen ja näyttämiseen
function getProducts(category, query) {
    //määritetään url kateg. perusteella
    var url = category
    ? "https://fakestoreapi.com/products/category/" + encodeURIComponent(category)
    : "https://fakestoreapi.com/products";

    //luodaan toinen ajax-olio tuotteiden hakemista varten
    var xhr2 = new XMLHttpRequest();
    xhr2.open("GET", url, true);

    //kuunnellaan vastausta
    xhr2.onreadystatechange = function() {
        if (xhr2.readyState === 4 && xhr2.status === 200) {
            //parsitaan tuotteet json-muodosta
            var products =JSON.parse(xhr2.responseText);

            //jos hakusanan annettu, suodatetaan otsikon mukaan
            if (query) {
                products = products.filter(function(p) {
                    return p.title.toLowerCase().includes(query.toLowerCase());
                });
            }

            //näytetään suodatetut tuotteet käyttäjälle
            displayProducts(products);
        }
    };
    xhr2.send();

}

//funktio luo ja lisää tuotekortit dom-iin
function displayProducts(products) {
    var container = document.getElementById("productsContainer");
    container.innerHTML = ""; //tyhjennetään vanhat tuotteet

    // jos tuotteita ei löytynyt, näytetään viesti
    if (products.length === 0) {
        var msg = document.createElement("p");
        msg.textContent = "Ei tuotteita.";
        container.appendChild(msg);
        return;
    }

    //käydään kaikki tuotteet läpi ja luodaan kortit
    products.forEach(function(p) {
        var card = document.createElement("div");
        card.className = "product-card";

        var img = document.createElement("img");
        img.src = p.image;
        img.alt = p.title;
        card.appendChild(img);

        var h2 = document.createElement("h2");
        h2.textContent = p.title;
        card.appendChild(h2);

        var desc = document.createElement("p");
        desc.textContent = p.description.slice(0, 100) + "...";
        card.appendChild(desc);

        var price = document.createElement("p");
        price.className = "price";
        price.textContent = "€" + p.price;
        card.appendChild(price);

        container.appendChild(card);
    });
}