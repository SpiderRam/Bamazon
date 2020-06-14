# Bamazon

No flashy interface on this one, just run it with one of the following commands:

`node bamazonCustomer` -- displays items available to buy, updates stock quantity and total sales after a purchase.

`node bamazonManager` -- allows you to view products or sale, view low quantity items, add inventory, and add new products.

`node bamazonSupervisor` -- allows you to create new departments, and view sales by department.

---

At the time, the most difficult part of this was the `viewProductSales()` function, bamazonSupervisor 46-54. It is difficult to read in the .js format, it is better understood written thus:

#### --> This section is specifying the content, before the table has technically been created, and performing the math to create and populate a new column called total_profit. <--

-   SELECT prodDept.department_id, prodDept.department_name, prodDept.over_head_costs,
-   SUM (prodDept.product_sales) AS product_sales,
-   (SUM (prodDept.product_sales) - prodDept.over_head_costs) AS total_profit

#### --> Begin section that actually creates the new, temporary table <--

-   FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs,
-   IFNULL (products.product_sales, 0)
-   AS product_sales
-   FROM products
-   RIGHT JOIN departments
-   ON products.department_name = departments.department_name)

#### --> This names the new table and sets its ordering of contents. <--

-   AS prodDept GROUP BY department_id
