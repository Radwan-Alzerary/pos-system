
function printinvoice(invoiceId, loction, phonenumber) {
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
            var deleveryinfo = "";
            if (loction && phonenumber) {
                deleveryinfo = `  <div class="footerpos">
                <a>عنوان الطلبية : ${loction}</a>
            </div>
            <div class="footerpos">
                <a>رقم الطلبية : ${phonenumber}</a>
            </div>
            `
            } else {
                deleveryinfo = ""
            }
            console.log(items)



            const htmltoprint = `<html lang="en">

            <head>
            
                <style>
                    * {
                        font-size: 1.5rem;
                         font-family: 'Times New Roman';
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
                        width: 100%;
                        border-top: 1px solid black;
                        border-collapse: collapse;
                    }
                
                    td.description,
                    th.description {
                        width: 40%;
                        max-width: 75px;
                    }
                
                    td.quantity,
                    th.quantity {
                        width: 15%;
                        max-width: 40px;
                        word-break: break-all;
                    }
                
                    td.price,
                    th.price {
                        width: 30%;
                        max-width: 40px;
                        word-break: break-all;
                    }

                    td.finalprice,
                    th.finalprice {
                
                        font-weight: bold;
                    }
            
                    .centered {
                        font-size: 3.2rem;
                        text-align: center;
                        align-content: center;
                    }
                    main{
                        padding: 6px;
                        width: 520px;
                    }

                    .ticket {
                        padding: 6px;
                        width: 520px;
                        max-width: 480px;
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
                        <hr>
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
                    ${deleveryinfo}
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
                body: JSON.stringify({ htmbody: htmltoprint })
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





