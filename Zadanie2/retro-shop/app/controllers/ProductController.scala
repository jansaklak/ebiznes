// app/controllers/ProductsController.scala
package controllers

import models.Product
import play.api.libs.json._
import play.api.mvc._
import javax.inject._

@Singleton
class ProductsController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {
  
  implicit val productWrites: Writes[Product] = Json.writes[Product]
  implicit val productReads: Reads[Product] = Json.reads[Product]
  
  private var products = List(
    Product(1, "Pentium II", "Procesor Intel Pentium II 350 MHz", 150.00),
    Product(2, "Voodoo 3", "Karta graficzna 3dfx Voodoo 3 3000", 300.00),
    Product(3, "Sound Blaster 16", "Karta dźwiękowa Creative Sound Blaster 16", 80.00),
    Product(4, "RAM 128MB", "Pamięć RAM SDRAM 128MB", 120.00),
    Product(5, "Hard Drive 20GB", "Dysk twardy IDE 20GB 5400 RPM", 200.00),
    Product(6, "CD-ROM 52x", "Napęd CD-ROM 52x", 70.00)
  )
  
  private var idCounter: Long = products.map(_.id).max + 1
  
  def create(): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].fold(
      errors => {
        BadRequest(Json.obj("message" -> JsError.toJson(errors)))
      },
      product => {
        val newProduct = product.copy(id = idCounter)
        idCounter += 1
        products = products :+ newProduct
        Created(Json.toJson(newProduct))
      }
    )
  }
  
  def list(): Action[AnyContent] = Action {
    Ok(Json.toJson(products))
  }
  
  def get(id: Long): Action[AnyContent] = Action {
    products.find(_.id == id) match {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound(Json.obj("message" -> s"Product with id $id not found"))
    }
  }
  
  def update(id: Long): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].fold(
      errors => {
        BadRequest(Json.obj("message" -> JsError.toJson(errors)))
      },
      product => {
        products.find(_.id == id) match {
          case Some(_) => 
            // Remove old product and add updated one
            products = products.filterNot(_.id == id)
            val updatedProduct = product.copy(id = id)
            products = products :+ updatedProduct
            Ok(Json.toJson(updatedProduct))
          case None => 
            NotFound(Json.obj("message" -> s"Product with id $id not found"))
        }
      }
    )
  }
  
  def delete(id: Long): Action[AnyContent] = Action {
    products.find(_.id == id) match {
      case Some(_) => 
        products = products.filterNot(_.id == id)
        NoContent
      case None => 
        NotFound(Json.obj("message" -> s"Product with id $id not found"))
    }
  }
}