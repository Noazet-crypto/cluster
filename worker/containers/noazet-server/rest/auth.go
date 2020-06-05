package rest

import (
	"errors"
	"net/http"

	"github.com/Noazet-crypto/trading-engine/models"
	"github.com/Noazet-crypto/trading-engine/service"
	"github.com/gin-gonic/gin"
)

const keyCurrentUser = "__current_user"

func checkToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.Query("token")
		if len(token) == 0 {
			var err error
			token, err = c.Cookie("accessToken")
			if err != nil {
				c.AbortWithStatusJSON(http.StatusForbidden, newMessageVo(errors.New("token not found")))
				return
			}
		}
		user, err := service.CheckToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, newMessageVo(err))
			return
		}
		if user == nil {
			c.AbortWithStatusJSON(http.StatusForbidden, newMessageVo(errors.New("bad token")))
			return
		}
		c.Set(keyCurrentUser, user)
		c.Next()
	}
}

func GetCurrentUser(ctx *gin.Context) *models.User {
	val, found := ctx.Get(keyCurrentUser)
	if !found {
		return nil
	}
	return val.(*models.User)
}
