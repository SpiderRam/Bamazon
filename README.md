# Bamazon

* The most difficult part of this was the `viewProductSales()` function, bamazonSupervisor46-54.  It is difficult to read in the .js format, it is better understood written thus:

#### --> This section is specifying the content, before the table has technically been created. <--
- "SELECT prodDept.department_id, prodDept.department_name, prodDept.over_head_costs,
- SUM (prodDept.product_sales) AS product_sales,
- (SUM (prodDept.product_sales) - prodDept.over_head_costs) AS total_profit FROM
#### --> Begin section that actually creates the new, temporary table <--
- (SELECT departments.department_id, departments.department_name, departments.over_head_costs,
- IFNULL (products.product_sales, 0)
- AS product_sales FROM products
- RIGHT JOIN departments
- ON products.department_name = departments.department_name)
#### --> This names the new table and sets its ordering of contents. <--
- AS prodDept GROUP BY department_id"

## bamazonCustomer.js:

