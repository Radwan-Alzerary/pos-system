
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
                <td class="description">${item[2]}</td>
                <td class="quantity">${item[1]}</td>
                <td class="price">${item[0]}</td>
                <td class="price">${item[3]}</td>
            </tr>
                `
            }
            var deleveryinfo = "";
            if (loction && phonenumber) {
                deleveryinfo = `
                <div style:"text-align : right">
                <div class="footerpos" style = "text-align: right">
                <a>عنوان الطلبية : ${loction}</a>
            </div>
            <div class="footerpos" style = "text-align: right">
                <a>رقم الهاتف : ${phonenumber}</a>
            </div>
            </div>
            `
            } else {
                deleveryinfo = ""
            }
            console.log(items)

            const invoicedateString = data.invoicedate;
            const invoicedate = new Date(invoicedateString);
            
            const dateyear = `${invoicedate.getFullYear()}/${invoicedate.getMonth()}/${invoicedate.getDate()}`;
            const dateclock = `${invoicedate.getHours()}:${invoicedate.getMinutes()}:${invoicedate.getSeconds()}`;
            
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










            const htmltoprint2 = `
            <!DOCTYPE html>
<html lang="ar">

<head>
    <style>
        * {
            font-size: 1.1rem;
            margin: 0px;
            font-family: 'Arial';
        }

        main {
            padding: 6px;
            width: 300px;
        }

        .dashed-line {
            border: none;
            height: 2px;
            /* Set the desired height for the dashed line */
            background-image: repeating-linear-gradient(to right, black, black 8px, transparent 8px, transparent 16px);
        }

        .centerdiv {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        table,
        th,
        td {
            border: 1px solid black;
            border-collapse: collapse;
        }

        table {
            width: 100%;
        }

        th,
        td {
            text-align: center;
        }
    </style>
</head>

<body>
    <main>
        <hr class="dashed-line">
        <div class="centerdiv">
            <a style="font-weight: bold; margin-top: 3px; margin-bottom: 3px;">
                ${data.setting.shopname}
            </a>
        </div>
        <hr class="dashed-line">
        <div style="margin-top: 10px;">
            <div style="display: flex; justify-content: space-between;">
                <div>
                </div>
                <div style="text-align: right;">
                    اسم العميل : احمد ياسر محمد
                </div>

            </div>
            <div style="display: flex; justify-content: space-between;margin-top: 6px;">
                <div style="margin-left: 27px;">
                    ر.الطاولة: 4
                </div>
                <div>
                
                    التاريخ : ${dateyear}
                </div>

            </div>
            <div style="display: flex;justify-content: space-between;margin-top: 4px;margin-bottom: 4px;">
                <div>
                    ر.الوصل : ${data.invoicenumber}
                </div>
                <div>
                    الوقت : ${dateclock}
                </div>

            </div>
        </div>
        <table style="width:100%">
            <tr>
                <th>السعر</th>
                <th>العدد</th>
                <th>اسم المادة</th>
                <th>الاجمالي</th>
            </tr>
            ${items}
        </table>

        <div style="display: flex;justify-content: end;margin-top: 10px;">
            <div style="text-align: right;">
                <div>
                    <a style="margin-right: 20px;">اجمالي الفاتورة</a>
                </div>
                <div style="margin-top: 3px;">
                    <a style="margin-right: 20px;">اجمالي الخصومات</a>
                </div>
                <div style="margin-top: 7px;font-weight: bold;">
                    <a style="margin-right: 20px;">د.ع المجموع</a>
                </div>
                
                
            </div>
            <div style="text-align: center;">
                <div>
                    <a>${data.fullcost}</a>
                </div>
                <div style="margin-top: 3px;">
                    <a>${data.fulldiscont}</a>
                </div>
                <div style="margin-top: 3px;font-weight: bold; border: 2px solid black;padding: 2px;">
                    <a>${data.finalcost}</a>
                </div>

            </div>

        </div>
        <hr class="dashed-line" style="margin-top: 20px;">
        <div style="text-align: right;">
        <div style="margin-top: 4px;text-align: right;">
            العنوان : ${data.setting.adress}
        </div>
        <div style="margin-top: 4px;text-align: right;">
             الهاتف : ${data.setting.phonnumber}
        </div>
    </div>

        <div class="centerdiv" style="padding-top: 10px; font-size:1.8rem">
            شكرا لتعاملكم معنا
        </div>

        ${deleveryinfo}
    </main>
</body>
</html>
            
            `
            console.log(htmltoprint)


            fetch("/invoice/printinvoice/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ htmbody: htmltoprint2 })
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





