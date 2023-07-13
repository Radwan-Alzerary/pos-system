
function printinvoice(invoiceId) {
    fetch(`/invoice/${invoiceId}/checout`)
        .then(response => response.json())
        .then(data => {

            // Create the item rows (<tr>) with their cells (<td>)
            console.log()
            const itemRows = [
            ];

            data.food.forEach(food => {
                itemRows.push([`${food.id.name}`, `${food.quantity}`, `${food.id.price}`, `${Number(food.quantity) * Number(food.id.price)}`]);
            })

            var items = ""

            for (const item of itemRows) {

                items += `
                <tr>
                <td class="description">${item[0]}</td>
                <td class="quantity">${item[1]}</td>
                <td class="price">${item[2]}</td>
                <td class="price">${item[3]}</td>
            </tr>
                `
            }
            console.log(items)



            const htmltoprint = `<html lang="en">

            <head>
            
                <style>
                    * {
                        font-size: 12px;
                        font-family: 'Times New Roman';
                    }
                    body{
                        width: 240px;
                        max-width: 240px;
                        height: 100%;
                    }
                
                    .footerpos {
                        display: flex;
                        text-align: right;
                        align-items: right;
                        justify-content: flex-end;
                    }
                
                    td,
                    th,
                    tr,
                    table {
                        border-top: 1px solid black;
                        border-collapse: collapse;
                    }
                
                    td.description,
                    th.description {
                        width: 75px;
                        max-width: 75px;
                    }
                
                    td.quantity,
                    th.quantity {
                        width: 40px;
                        max-width: 40px;
                        word-break: break-all;
                    }
                
                    td.price,
                    th.price {
                        width: 40px;
                        max-width: 40px;
                        word-break: break-all;
                    }
                
                    td.finalprice,
                    th.finalprice {
                
                        font-weight: bold;
                    }
                
                
                    .centered {
                        font-size: 2rem;
                        text-align: center;
                        align-content: center;
                    }
                    main{
                        padding: 6px
                    }
                    .ticket {
                        padding: 6px;
                        width: 240px;
                        max-width: 240px;
                    }
                
                    .logoimg {
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                
                    td {
                        text-align: center;
                    }
                
                    img {
                        height: 100px;
                        max-width: inherit;
                        width: inherit;
                    }
                
                
                    @media print {
                
                        .hidden-print,
                        .hidden-print * {
                            display: none !important;
                        }
                    }
                </style>
                
            </head>
            

            

            <body>
                <main class="ticket">
                    <div class="logoimg">
                        <img src="${data.setting.shoplogo}" alt="Logo">
                    </div>
                    <p class="centered">الفاتورة
                    </p>
                    <div class="footerpos">
                        <a>العنوان : ${data.setting.adress}</a>
                    </div>
                    <div class="footerpos">
                        <a>رقم الهاتف : ${data.setting.phonnumber}</a>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th class="description">الاسم</th>
            
                                <th class="quantity">#</th>
            
                                <th class="price">السعر</th>
                                <th class="price">الكلي</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items}
                            <tr>
                                <td class="quantity"></td>
                                <td class="quantity"></td>
                                <td class="description">المجموع</td>
                                <td class="finalprice ">${data.fullcost}</td>
                            </tr>
            
                            <tr>
                                <td class="quantity"></td>
                                <td class="quantity"></td>
                                <td class="description">الخصومات</td>
                                <td class="finalprice ">${data.fulldiscont}</td>
                            </tr>
            
                            <tr>
                                <td class="quantity"></td>
                                <td class="quantity"></td>
                                <td class="description">الكلي</td>
                                <td class="finalprice ">${data.finalcost}</td>
                            </tr>
            
            
                        </tbody>
                    </table>
            
                    <p class="centered">شكرا لتعاملكم معنا
                    </p>
            
                </div>
            </body>
            
            </html>
            `
            console.log(htmltoprint)


            fetch("/invoice/printinvoice/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({htmbody: htmltoprint})
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)

                })
                .catch(error => {
                    console.error('Error:', error);
                    // Handle errors
                });


        })
        .catch(error => {
            console.error(error);
        });
}





