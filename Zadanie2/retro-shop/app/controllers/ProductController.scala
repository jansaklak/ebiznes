package controllers

import javax.inject._
import play.api.mvc._
import play.api.libs.json._
import models.Product

@Singleton
class ProductController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

  private var products = List(
    Product(1, "Pentium II", "Procesor Intel Pentium II 350 MHz", 150.00),
    Product(2, "Voodoo 3", "Karta graficzna 3dfx Voodoo 3 3000", 300.00),
    Product(3, "Sound Blaster 16", "Karta dźwiękowa Creative Sound Blaster 16", 80.00)
  )

  def list(): Action[AnyContent] = Action {
    Ok(Json.toJson(products))
  }

  def get(id: Int): Action[AnyContent] = Action {
    products.find(_.id == id) match {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound(Json.obj("error" -> "Product not found"))
    }
  }

  def create(): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product] match {
      case JsSuccess(newProduct, _) =>
        products = products :+ newProduct
        Created(Json.toJson(newProduct))
      case JsError(errors) =>
        BadRequest(Json.obj("error" -> "Invalid JSON", "details" -> errors.toString))
    }
  }

  def update(id: Int): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product] match {
      case JsSuccess(updatedProduct, _) =>
        products.find(_.id == id) match {
          case Some(_) =>
            products = products.map(p => if (p.id == id) updatedProduct else p)
            Ok(Json.toJson(updatedProduct))
          case None => NotFound(Json.obj("error" -> "Product not found"))
        }
      case JsError(errors) =>
        BadRequest(Json.obj("error" -> "Invalid JSON", "details" -> errors.toString))
    }
  }

  def delete(id: Int): Action[AnyContent] = Action {
    products.find(_.id == id) match {
      case Some(_) =>
        products = products.filterNot(_.id == id)
        NoContent
      case None => NotFound(Json.obj("error" -> "Product not found"))
    }
  }
}
